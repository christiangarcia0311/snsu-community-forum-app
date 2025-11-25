from rest_framework import serializers

from .models import ThreadPost, ThreadComment, ThreadLike
from portal.serializers import UserProfileDetailSerializer

class ThreadPostSerializer(serializers.ModelSerializer):
    author_profile = UserProfileDetailSerializer(source='author.profile', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_author_admin = serializers.SerializerMethodField()
    
    class Meta:
        model = ThreadPost 
        
        fields = [
            'id',
            'author',
            'author_username',
            'author_profile',
            'title',
            'content',
            'image',
            'thread_type',
            'created_at',
            'updated_at',
            'likes_count',
            'is_liked',
            'comments_count',
            'is_author_admin'
        ]
        
        read_only_fields = ['author', 'created_at']
        
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ThreadLike.objects.filter(thread=obj, user=request.user).exists()
        return False
    
    def get_is_author_admin(self, obj):
        return obj.author.is_superuser
        
        
class ThreadPostCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model =  ThreadPost
        fields = ['title', 'content', 'image', 'thread_type']
        
    def validate_title(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('Title must be at least 10 character length')

        return value 
    
    def validate_content(self, value):
        if len(value.strip()) < 20:
            raise serializers.ValidationError('Content must be at least 20 character length')
    
        return value

class ThreadCommentSerializer(serializers.ModelSerializer):
    author_profile = UserProfileDetailSerializer(source='author.profile', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = ThreadComment
        fields = [
            'id', 
            'thread', 
            'author', 
            'author_username', 
            'author_profile', 
            'content', 
            'created_at'
        ]
        
        read_only_fields = ['author', 'created_at']
        
class ThreadLikeSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ThreadLike
        fields = [
            'id', 
            'thread', 
            'user', 
            'user_username', 
            'created_at'
        ]
        
        read_only_fields = ['user', 'created_at']
        
