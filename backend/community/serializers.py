from rest_framework import serializers
from .models import CommunityGroup, CommunityMembership, CommunityPost
from portal.serializers import UserProfileDetailSerializer

class CommunityGroupSerializer(serializers.ModelSerializer):
    
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    created_by_profile = UserProfileDetailSerializer(source='created_by.profile', read_only=True)
    is_member = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityGroup
        fields = [
            'id',
            'name',
            'description',
            'image',
            'created_by',
            'created_by_username',
            'created_by_profile',
            'created_at',
            'updated_at',
            'is_active',
            'is_private',
            'member_count',
            'is_member',
            'user_role'
        ]
        
        read_only_fields = ['created_by', 'created_at', 'member_count']
        
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CommunityMembership.objects.filter(
                user=request.user,
                community=obj
            ).exists()
        return False
    
    def get_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            membership = CommunityMembership.objects.filter(
                user=request.user,
                community=obj
            ).first()
            return membership.role if membership else None
        return None
    
class CommunityGroupCreateSerializer(serializers.ModelSerializer):
        
    class Meta:
        model = CommunityGroup
        fields = ['name', 'description', 'image', 'is_private']
    
    def validate_name(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError('Community name must be at least 5 characters')
        
        if len(value.strip()) > 100:
            raise serializers.ValidationError('Community name cannot exceed 100 characters')

        return value
    
    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('Description must be at least 10 characters')
        
        return value
    
class CommunityMembershipSerializer(serializers.ModelSerializer):
    
    user_profile = UserProfileDetailSerializer(source='user.profile', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    community_name = serializers.CharField(source='community.name', read_only=True)
    
    class Meta:
        model = CommunityMembership
        fields = [
            'id',
            'user',
            'username',
            'user_profile',
            'community',
            'community_name',
            'role',
            'joined_at'
        ]
        read_only_fields = ['joined_at']
        
class CommunityPostSerializer(serializers.ModelSerializer):
    
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_profile = UserProfileDetailSerializer(source='author.profile', read_only=True)
    community_name = serializers.CharField(source='community.name', read_only=True)
    can_edit = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityPost
        fields = [
            'id',
            'community',
            'community_name',
            'author',
            'author_username',
            'author_profile',
            'title',
            'content',
            'image',
            'created_at',
            'updated_at',
            'is_pinned',
            'can_edit',
            'can_delete'
        ]
        read_only_fields = ['author', 'created_at']
        
    
    def get_can_edit(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if obj.author == request.user:
                return True
            membership = CommunityMembership.objects.filter(
                user=request.user,
                community=obj.community,
                role__in=['moderator', 'admin']
            ).first()
            return bool(membership)
        return False
    
    def get_can_delete(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if obj.author == request.user:
                return True
            membership = CommunityMembership.objects.filter(
                user=request.user,
                community=obj.community,
                role__in=['moderator', 'admin']
            ).first()
            return bool(membership)
        return False
    
    
class CommunityPostCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CommunityPost
        fields = ['community', 'title', 'content', 'image']
        
    def validate_title(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('Title must be at least 10 characters long')
        return value
    
    def validate_content(self, value):
        if len(value.strip()) < 40:
            raise serializers.ValidationError('Content must be at least 40 characters long')
        return value
    
    