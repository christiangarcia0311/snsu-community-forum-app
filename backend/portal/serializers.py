from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import UserProfile, UserFollow
from .utils import create_send_otp_verification_code

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
        
        '''create student/faculty user and send verification OTP'''
        
        validated_data.pop('confirm_password')
        profile_data = validated_data.pop('profile')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=False
        )
        
        UserProfile.objects.create(
            user=user,
            **profile_data
        )
        
        request = self.context.get('request') if self.context else None
        create_send_otp_verification_code(user, request=request)
        
        return user
        
        
class UserProfileDetailSerializer(serializers.ModelSerializer):
    
    '''retrieving user details'''
    
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    profile_image_url = serializers.SerializerMethodField()
    
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    department_display = serializers.CharField(source='get_department_display', read_only=True)
    course_display = serializers.CharField(source='get_course_display', read_only=True)
    
    can_update_profile = serializers.SerializerMethodField()
    days_until_next_update = serializers.SerializerMethodField()
    # password change cooldown
    can_change_password = serializers.SerializerMethodField()
    days_until_password_change = serializers.SerializerMethodField()
    
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'username',
            'email',
            'firstname',
            'lastname',
            'birth_date',
            'gender',
            'gender_display',
            'role',
            'role_display',
            'department',
            'department_display',
            'course',
            'course_display',
            'profile_image',
            'profile_image_url',
            'created_at',
            'can_update_profile',
            'days_until_next_update',
            'can_change_password',
            'days_until_password_change',
            'followers_count',
            'following_count',
            'is_following'
        ]
        
    def get_profile_image_url(self, obj):
        
        '''get user image'''
        
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
        return None
    
    def get_can_update_profile(self, obj):
        
        '''CAN UPDATE PROFILE DETAILS?'''
        
        return obj.can_update_profile_details()
    
    def get_days_until_next_update(self, obj):
        
        '''CALCULATE DAYS UNTIL NEXT UPDATE'''
        
        return obj.days_until_next_update()
    
    def get_followers_count(self, obj):
        return obj.user.followers.count()
    
    def get_following_count(self, obj):
        return obj.user.following.count()
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user == obj.user:
                return None  # Can't follow yourself
            return UserFollow.objects.filter(
                follower=request.user,
                following=obj.user
            ).exists()
        return False

    def get_can_change_password(self, obj):
        return obj.can_change_password()

    def get_days_until_password_change(self, obj):
        return obj.days_until_password_change()
    
class UserFollowSerializer(serializers.ModelSerializer):
    follower_username = serializers.CharField(source='follower.username', read_only=True)
    following_username = serializers.CharField(source='following.username', read_only=True)
    follower_profile = UserProfileDetailSerializer(source='follower.profile', read_only=True)
    following_profile = UserProfileDetailSerializer(source='following.profile', read_only=True)
    
    class Meta:
        model = UserFollow
        fields = [
            'id',
            'follower',
            'follower_username',
            'follower_profile',
            'following',
            'following_username',
            'following_profile',
            'created_at'
        ]
        read_only_fields = ['follower', 'created_at']
    
class UpdateProfileDetailsSerializer(serializers.ModelSerializer):
    
    '''update profile details'''
    
    username = serializers.CharField() 
    
    class Meta:
        model = UserProfile
        fields = [
            'username',
            'firstname',
            'lastname',
            'birth_date',
            'gender',
            'role',
            'department',
            'course'
        ]
        
    def validate_username(self, value):
        
        '''Validate unique username'''
        
        user = self.context['request'].user
        if User.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError('Username already taken')

        return value
    
    def update(self, instance, validated_data):
        
        '''Update profile and username'''
        
        username = validated_data.pop('username', None)
        
        if username:
            instance.user.username = username
            instance.user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        return instance
    
    
class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)

        if user and user.is_active:
            return user

        # If credentials are correct but user is inactive, return clearer message
        if user and not user.is_active:
            raise serializers.ValidationError('Account not verified. Please check your email for the verification code.')

        raise serializers.ValidationError('Invalid credentials')