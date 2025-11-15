from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import UserProfile

import json

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'firstname', 
            'lastname', 
            'birth_date', 
            'gender', 
            'role', 
            'department', 
            'course',
            'profile_image'
        ]

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    profile = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = (
            'username', 
            'email', 
            'password', 
            'confirm_password', 
            'profile'
        )
        
    def validate_email(self, value):
        '''validate email domain only for snsu students'''
        
        if not value.endswith('@ssct.edu.ph'):
            raise serializers.ValidationError('Email must be from ssct.edu.ph domain')
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already registered')
        
        return value
    
    def validate_username(self, value):
        '''validate unique username for students'''
        
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken')
        return value
    
    def validate_profile(self, value):
        '''validate and parse profile JSON data'''
        
        try:
            profile_data = json.loads(value)
            

            required_fields = ['firstname', 'lastname', 'birth_date', 'gender', 'role', 'department', 'course']
            for field in required_fields:
                if field not in profile_data:
                    raise serializers.ValidationError(f'{field} is required in profile data')
            
            return profile_data
        except json.JSONDecodeError:
            raise serializers.ValidationError('Invalid JSON format for profile data')
    
    def validate(self, data):
        '''validate password confirmation'''
        
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match'
            })
            
        return data
    
    def create(self, validated_data):
        '''create student/faculty user'''
        
        validated_data.pop('confirm_password')
        profile_data = validated_data.pop('profile')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        UserProfile.objects.create(
            user=user,
            **profile_data
        )
        
        return user
        
        
class UserProfileDetailSerializer(serializers.ModelSerializer):
    '''retrieving user details'''
    
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    profile_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'username',
            'email',
            'firstname',
            'lastname',
            'birth_date',
            'gender',
            'role',
            'department',
            'course',
            'profile_image',
            'profile_image_url',
            'created_at'
        ]
        
    def get_profile_image_url(self, obj):
        '''get user image'''
        
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
        return None
    
class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)
        
        if user and user.is_active:
            return user 
        
        raise serializers.ValidationError('Invalid credentials')