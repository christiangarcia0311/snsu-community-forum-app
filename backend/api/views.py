from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import login
from .serializers import (
    SignUpSerializer, 
    SignInSerializer, 
    UserProfileDetailSerializer
)
from .models import UserProfile

class SignUpView(generics.CreateAPIView):
    
    '''API endpoint for user registration'''
    
    serializer_class = SignUpSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
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