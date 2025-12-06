from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q

from .models import CommunityGroup, CommunityMembership, CommunityPost
from .serializers import (
    CommunityGroupSerializer,
    CommunityGroupCreateSerializer,
    CommunityMembershipSerializer,
    CommunityPostSerializer,
    CommunityPostCreateSerializer
)

class CommunityGroupListView(APIView):
    
    '''API endpoint to list all community group'''
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        communities = CommunityGroup.objects.filter(is_active=True)
        serializer = CommunityGroupSerializer(communities, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CommunityGroupCreateView(APIView):
    
    '''API endpoint for creating community group - Only admins can create'''
    
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        # Check if user is admin/staff
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({
                'error': 'Only administrators can create community groups'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CommunityGroupCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            community = serializer.save(created_by=request.user)
            
            # Automatically make creator an admin member
            CommunityMembership.objects.create(
                user=request.user,
                community=community,
                role='admin'
            )
            community.member_count = 1
            community.save()
            
            response_serializer = CommunityGroupSerializer(community, context={'request': request})
            return Response({
                'message': 'Community group created',
                'community': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommunityGroupDetailView(APIView):
    
    '''API endpoint for retrieving, updating and deleting community groups'''
    
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def get_object(self, pk):
        try:
            return CommunityGroup.objects.get(pk=pk, is_active=True)
        except CommunityGroup.DoesNotExist:
            return None
    
    def get(self, request, pk):
        community = self.get_object(pk)
        if not community:
            return Response({
                'error': 'Community not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CommunityGroupSerializer(community, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        community = self.get_object(pk)
        if not community:
            return Response({
                'error': 'Community not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Only superuser can update
        if not request.user.is_superuser:
            return Response({
                'error': 'Only administrators can update communities'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CommunityGroupCreateSerializer(community, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response_serializer = CommunityGroupSerializer(community, context={'request': request})
            return Response({
                'message': 'Community updated',
                'community': response_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        community = self.get_object(pk)
        if not community:
            return Response({
                'error': 'Community not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Only superuser can delete
        if not request.user.is_superuser:
            return Response({
                'error': 'Only administrators can delete communities'
            }, status=status.HTTP_403_FORBIDDEN)
        
        community.is_active = False
        community.save()
        return Response({
            'message': 'Community deleted'
        }, status=status.HTTP_200_OK)
        
        
class CommunityMembershipView(APIView):
    
    '''API endpoint for joining/leaving community group'''
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        """JOIN GROUP"""
        try:
            community = CommunityGroup.objects.get(pk=pk, is_active=True)
        except CommunityGroup.DoesNotExist:
            return Response({
                'error': 'Community not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already a member
        if CommunityMembership.objects.filter(user=request.user, community=community).exists():
            return Response({
                'error': 'You are already a member of this community'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create membership
        membership = CommunityMembership.objects.create(
            user=request.user,
            community=community,
            role='member'
        )
        
        # Update member count
        community.member_count += 1
        community.save()
        
        return Response({
            'message': f'Successfully joined {community.name}',
            'membership': CommunityMembershipSerializer(membership).data
        }, status=status.HTTP_201_CREATED)
    
    def delete(self, request, pk):
        
        '''LEAVE GROUP'''
        
        try:
            community = CommunityGroup.objects.get(pk=pk, is_active=True)
        except CommunityGroup.DoesNotExist:
            return Response({
                'error': 'Community not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            membership = CommunityMembership.objects.get(user=request.user, community=community)
        except CommunityMembership.DoesNotExist:
            return Response({
                'error': 'You are not a member of this community'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Prevent last admin from leaving
        if membership.role == 'admin':
            admin_count = CommunityMembership.objects.filter(
                community=community,
                role='admin'
            ).count()
            if admin_count <= 1:
                return Response({
                    'error': 'Cannot leave - you are the last admin'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        membership.delete()
        
        # Update member count
        community.member_count = max(0, community.member_count - 1)
        community.save()
        
        return Response({
            'message': f'Successfully left {community.name}'
        }, status=status.HTTP_200_OK)
        
class CommunityMembersListView(APIView):
    
    '''API endpoint for listing community members'''
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            community = CommunityGroup.objects.get(pk=pk, is_active=True)
        except CommunityGroup.DoesNotExist:
            return Response({
                'error': 'Community not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user is a member
        is_member = CommunityMembership.objects.filter(
            user=request.user,
            community=community
        ).exists()
        
        if not is_member and community.is_private:
            return Response({
                'error': 'This is a private community'
            }, status=status.HTTP_403_FORBIDDEN)
        
        members = CommunityMembership.objects.filter(community=community)
        serializer = CommunityMembershipSerializer(members, many=True)
        
        return Response({
            'count': members.count(),
            'members': serializer.data
        }, status=status.HTTP_200_OK)
        
class UpdateMemberRoleView(APIView):
    
    '''API endpoint for updating member roles (admin and moderator)'''
    
    permission_classes = [IsAuthenticated]
    
    def put(self, request, pk, member_id):
        try:
            community = CommunityGroup.objects.get(pk=pk, is_active=True)
        except CommunityGroup.DoesNotExist:
            return Response({
                'error': 'Community not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if requester is admin
        requester_membership = CommunityMembership.objects.filter(
            user=request.user,
            community=community,
            role='admin'
        ).first()
        
        if not requester_membership and not request.user.is_superuser:
            return Response({
                'error': 'Only admins can update member roles'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            membership = CommunityMembership.objects.get(id=member_id, community=community)
        except CommunityMembership.DoesNotExist:
            return Response({
                'error': 'Member not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        new_role = request.data.get('role')
        if new_role not in ['member', 'moderator', 'admin']:
            return Response({
                'error': 'Invalid role'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        membership.role = new_role
        membership.save()
        
        return Response({
            'message': 'Member role updated',
            'membership': CommunityMembershipSerializer(membership).data
        }, status=status.HTTP_200_OK)
        
        
class CommunityPostListView(APIView):
    
    '''API endpoint for listing posts in a community group'''
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            community = CommunityGroup.objects.get(pk=pk, is_active=True)
        except CommunityGroup.DoesNotExist:
            return Response({
                'error': 'Community not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user is a member
        is_member = CommunityMembership.objects.filter(
            user=request.user,
            community=community
        ).exists()
        
        if not is_member:
            return Response({
                'error': 'You must be a member to view posts'
            }, status=status.HTTP_403_FORBIDDEN)
        
        posts = CommunityPost.objects.filter(community=community)
        serializer = CommunityPostSerializer(posts, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CommunityPostCreateView(APIView):
    
    '''API endpoint for creating posts in a community group'''
    
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        serializer = CommunityPostCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            community_id = serializer.validated_data.get('community').id
            
            # Check if user is a member
            is_member = CommunityMembership.objects.filter(
                user=request.user,
                community_id=community_id
            ).exists()
            
            if not is_member:
                return Response({
                    'error': 'You must be a member to post'
                }, status=status.HTTP_403_FORBIDDEN)
            
            post = serializer.save(author=request.user)
            response_serializer = CommunityPostSerializer(post, context={'request': request})
            
            return Response({
                'message': 'Post created successfully',
                'post': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class CommunityPostDetailView(APIView):
    
    
    '''API endpoint for retrieving, updating and deleting comunnity group posts'''
    
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def get_object(self, pk):
        try:
            return CommunityPost.objects.get(pk=pk)
        except CommunityPost.DoesNotExist:
            return None
    
    def get(self, request, pk):
        post = self.get_object(pk)
        if not post:
            return Response({
                'error': 'Post not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user is a member
        is_member = CommunityMembership.objects.filter(
            user=request.user,
            community=post.community
        ).exists()
        
        if not is_member:
            return Response({
                'error': 'You must be a member to view this post'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CommunityPostSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        post = self.get_object(pk)
        if not post:
            return Response({
                'error': 'Post not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check permission
        membership = CommunityMembership.objects.filter(
            user=request.user,
            community=post.community
        ).first()
        
        if not membership:
            return Response({
                'error': 'You are not a member of this community'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Author or moderator/admin can edit
        can_edit = (post.author == request.user or 
                   membership.role in ['moderator', 'admin'])
        
        if not can_edit:
            return Response({
                'error': 'You do not have permission to edit this post'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CommunityPostCreateSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response_serializer = CommunityPostSerializer(post, context={'request': request})
            return Response({
                'message': 'Post updated',
                'post': response_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        post = self.get_object(pk)
        if not post:
            return Response({
                'error': 'Post not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check permission
        membership = CommunityMembership.objects.filter(
            user=request.user,
            community=post.community
        ).first()
        
        if not membership:
            return Response({
                'error': 'You are not a member of this community'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Author or moderator/admin can delete
        can_delete = (post.author == request.user or 
                     membership.role in ['moderator', 'admin'])
        
        if not can_delete:
            return Response({
                'error': 'You do not have permission to delete this post'
            }, status=status.HTTP_403_FORBIDDEN)
        
        post.delete()
        return Response({
            'message': 'Post deleted successfully'
        }, status=status.HTTP_200_OK)
        
class UserCommunitiesView(APIView):
    
    '''API endpoint for listing users joined communities'''
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        memberships = CommunityMembership.objects.filter(user=request.user)
        community_ids = memberships.values_list('community_id', flat=True)
        communities = CommunityGroup.objects.filter(id__in=community_ids, is_active=True)
        
        serializer = CommunityGroupSerializer(communities, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)