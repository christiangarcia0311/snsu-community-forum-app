from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import login
from .serializers import (
    SignUpSerializer, 
    SignInSerializer, 
    UserProfileDetailSerializer,
    UpdateProfileDetailsSerializer,
    UserFollowSerializer
)
from django.contrib.auth.models import User
from .models import UserProfile, UserFollow
from django.utils import timezone


from notifications.utils import create_follow_notification
from .utils import create_send_otp_verification_code

import pyotp
from .models import UserOTP

class SignUpView(generics.CreateAPIView):
    
    '''API endpoint for user registration'''
    
    serializer_class = SignUpSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = serializer.save()
            
            return Response({
                'message': 'User signup successfully',
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SignInView(APIView):
    
    '''API endpoint for user login'''
    
    serializer_class = SignInSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            
            return Response({
                'message': 'Signin successful',
                'username': user.username,
                'email': user.email,
            })
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    
    '''API endpoint for retrieving user profile details'''
    
    serializer_class = UserProfileDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile
    
class UpdateProfileDetailsView(APIView):
    
    '''API endpoint to update user profile details'''
    
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        profile = request.user.profile
        
        if not profile.can_update_profile_details():
            days_remaining = profile.days_until_next_update()
            return Response({
                'error': f'You can only update your profile once every 7 days. Please wait {days_remaining} more day(s).',
                'days_remaining': days_remaining,
                'can_update': False
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = UpdateProfileDetailsSerializer(
            profile, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            profile = serializer.save()
            
            profile.last_profile_details_update = timezone.now()
            profile.save()
            
            # Return updated profile with full details
            response_serializer = UserProfileDetailSerializer(
                profile, 
                context={'request': request}
            )
            
            return Response({
                'message': 'Profile updated successfully',
                'profile': response_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateProfileImageView(APIView):
    
    '''API endpoint to update profile image'''
    
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def patch(self, request):
        profile = request.user.profile
        
        if 'profile_image' not in request.FILES:
            return Response(
                {'error': 'No image provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        profile.profile_image = request.FILES['profile_image']
        profile.save()
        
        serializer = UserProfileDetailSerializer(profile, context={'request': request})
        
        return Response({
            'message': 'Profile image updated successfully',
            'profile': serializer.data
        }, status=status.HTTP_200_OK)
    
# UPDATE PASSWORD
class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        profile = request.user.profile

        # enforce password-change cooldown (14 days)
        if not profile.can_change_password():
            days_remaining = profile.days_until_password_change()
            return Response({
                'error': f'You can only change password once every 14 days. Please wait {days_remaining} more day(s).',
                'days_remaining': days_remaining,
                'can_change': False
            }, status=status.HTTP_403_FORBIDDEN)

        old_password = request.data.get('old_password', '')
        new_password = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')

        if not new_password or new_password != confirm_password:
            return Response({'error': 'New password and confirmation do not match'}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()

        # record password change timestamp
        profile.last_password_change = timezone.now()
        profile.save()

        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
    
# USER FOLLOW
class FollowUserView(APIView):
    
    '''API endpoint to follow/unfollow a user'''
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, username):
        try:
            user_to_follow = User.objects.get(username=username)

            if request.user == user_to_follow:
                return Response({
                    'error': 'You cannot follow yourself'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if already following
            follow_obj = UserFollow.objects.filter(
                follower=request.user,
                following=user_to_follow
            ).first()
            
            if follow_obj:
                return Response({
                    'error': 'You are already following this user'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create follow relationship
            UserFollow.objects.create(
                follower=request.user,
                following=user_to_follow
            )
 
            create_follow_notification(request.user, user_to_follow)
            
            return Response({
                'message': f'You are now following {username}',
                'is_following': True,
                'followers_count': user_to_follow.followers.count(),
                'following_count': request.user.following.count()
            }, status=status.HTTP_201_CREATED)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, username):
        try:
            user_to_unfollow = User.objects.get(username=username)
            
            follow_obj = UserFollow.objects.filter(
                follower=request.user,
                following=user_to_unfollow
            ).first()
            
            if not follow_obj:
                return Response({
                    'error': 'You are not following this user'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            follow_obj.delete()
            
            return Response({
                'message': f'You have unfollowed {username}',
                'is_following': False,
                'followers_count': user_to_unfollow.followers.count(),
                'following_count': request.user.following.count()
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
class UserFollowersListView(APIView):
    
    '''API endpoint to get list of followers'''
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            followers = UserFollow.objects.filter(following=user)
            serializer = UserFollowSerializer(followers, many=True, context={'request': request})
            
            return Response({
                'count': followers.count(),
                'followers': serializer.data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

class UserFollowingListView(APIView):
    
    '''API endpoint to get list of users being followed'''
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            following = UserFollow.objects.filter(follower=user)
            serializer = UserFollowSerializer(following, many=True, context={'request': request})
            
            return Response({
                'count': following.count(),
                'following': serializer.data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

class AllUsersListView(APIView):
    
    '''API endpoint to get all users'''
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            users = User.objects.filter(is_superuser=False).exclude(id=request.user.id)

            following_ids = UserFollow.objects.filter(
                follower=request.user
            ).values_list('following_id', flat=True)
            
            users_data = []
            for user in users:
                if hasattr(user, 'profile'):
                    profile = user.profile
                    profile_image_url = None
                    if profile.profile_image:
                        profile_image_url = request.build_absolute_uri(profile.profile_image.url)
                    
                    users_data.append({
                        'username': user.username,
                        'email': user.email,
                        'firstname': profile.firstname,
                        'lastname': profile.lastname,
                        'profile_image_url': profile_image_url,
                        'role': profile.role,
                        'department': profile.department,
                        'is_following': user.id in following_ids,
                        'followers_count': user.followers.count(),
                        'following_count': user.following.count()
                    })
            
            return Response({
                'count': len(users_data),
                'users': users_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            
class OTPVerifyView(APIView):
    
    '''
    Verify OTP code sent during signup
    '''
    
    permission_classes =  [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        otp_code = request.data.get('otp_code') or request.data.get('code') or request.data.get('otp')

        if not username:
            return Response({'error': 'username is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_code:
            return Response({'error': 'otp_code (or code/otp) is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp_obj = UserOTP.objects.get(user=user)
        except UserOTP.DoesNotExist:
            return Response({'error': 'No OTP request found for this user'}, status=status.HTTP_400_BAD_REQUEST)

        if otp_obj.is_verified:
            return Response({'message': 'Already verified'}, status=status.HTTP_200_OK)

        if not otp_obj.secret:
            return Response({'error': 'No OTP secret available for this user'}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(otp_obj.secret)

        if totp.verify(otp_code, valid_window=1):
            otp_obj.is_verified = True
            otp_obj.save()
            user.is_active = True
            user.save()
            return Response({'message': 'Verification successful. Account activated.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid or expired code'}, status=status.HTTP_400_BAD_REQUEST)
        
        
class OTPResendView(APIView):
    
    '''
    Verify resend OTP code to user's email
    '''
    
    permission_classes =  [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        if not username:
            return Response({'error': 'username is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        otp_obj = create_send_otp_verification_code(user, request=request, force_regen=True)
        return Response({'message': 'Verification code resent'}, status=status.HTTP_200_OK)