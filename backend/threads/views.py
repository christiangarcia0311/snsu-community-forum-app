from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import ThreadPost, ThreadComment, ThreadLike
from .serializers import (
    ThreadPostSerializer, 
    ThreadPostCreateSerializer, 
    ThreadCommentSerializer,
    ThreadLikeSerializer
)

from notifications.utils import (
    create_like_notification,
    create_comment_notification,
    create_new_post_notification
)

class ThreadPostListView(APIView):
    
    '''API endpoint for listing all thread posts'''

    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        threads =  ThreadPost.objects.all()
        serializers = ThreadPostSerializer(threads, many=True, context={'request': request})
        return Response(serializers.data, status=status.HTTP_200_OK)
    
class ThreadPostCreateView(APIView):
    
    '''API endpoint for creating a new thread post'''
    
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        serializer = ThreadPostCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            thread = serializer.save(author=request.user)
    
            create_new_post_notification(thread, request.user)
            
            response_serializer = ThreadPostSerializer(thread, context={'request': request}) 
            
            return Response({
                'message': 'Thread post created!',
                'thread': response_serializer.data
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    
class ThreadPostDetailView(APIView):
    
    '''API endpoint for retrieving, updating and deleting a thread post'''
    
    
    def get_object(self, pk):
        try:
            return ThreadPost.objects.get(pk=pk)
        except ThreadPost.DoesNotExist:
            return None 
        
    def get(self, request, pk):
        thread = self.get_object(pk)
        
        if not thread:
            return Response({
                'error': 'Thread post not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = ThreadPostSerializer(thread, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        thread = self.get_object(pk)
        
        if not thread:
            return Response({
                'error': 'Thread post not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
        # check thread post owner
        if thread.author != request.user:
            return Response({
                'error': 'You do not have permission to update this thread post'
            }, status=status.HTTP_403_FORBIDDEN)
            
        serializer = ThreadPostCreateSerializer(thread, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            response_serializer = ThreadPostSerializer(thread, context={'request': request})
            
            return Response({
                'message': 'Thread post updated',
                'thread': response_serializer.data
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        thread = self.get_object(pk)
        
        if not thread:
            return Response({
                'error': 'Thread post not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
        # check thread post owner
        if thread.author != request.user:
            return Response({
                'error': 'You do not have permission to update this thread post'
            }, status=status.HTTP_403_FORBIDDEN)
            
        thread.delete()
        return Response({
            'message': 'Thread post deleted'
        }, status=status.HTTP_200_OK)
        
        
class UserThreadPostsView(APIView):
    
    '''API endpoint retrieving thread posts by specific user'''
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        threads = ThreadPost.objects.filter(author=request.user)
        serializer = ThreadPostSerializer(threads, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ThreadCommentListCreateView(APIView):
    
    '''API endpoint for retrieving and create comment'''
    
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        comments = ThreadComment.objects.filter(thread_id=pk)
        serializer = ThreadCommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk):
        try:
            thread = ThreadPost.objects.get(pk=pk)
        except ThreadPost.DoesNotExist:
            return Response({'error': 'Thread not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ThreadCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(author=request.user, thread=thread)
            
            create_comment_notification(comment, thread, request.user)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ThreadLikeToggleView(APIView):
    
    '''API endpoint to click like and view user who like'''
    
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            thread = ThreadPost.objects.get(pk=pk)
        except ThreadPost.DoesNotExist:
            return Response({'error': 'Thread not found'}, status=status.HTTP_404_NOT_FOUND)

        like, created = ThreadLike.objects.get_or_create(thread=thread, user=request.user)
        if created:
   
            create_like_notification(thread, request.user)
            
            return Response({'message': 'Liked', 'likes_count': thread.likes.count(), 'is_liked': True}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            return Response({'message': 'Unliked', 'likes_count': thread.likes.count(), 'is_liked': False}, status=status.HTTP_200_OK)