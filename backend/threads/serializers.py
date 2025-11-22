from rest_framework import serializers

from .models import ThreadPost
from portal.serializers import UserProfileDetailSerializer

class ThreadPostSerializer(serializers.ModelSerializer):
    author_profile = UserProfileDetailSerializer(source='author.userprofile', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    
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
            'created_at',
            'updated_at'
        ]
        
        read_only_fields = ['author', 'created_at']
        
        
class ThreadPostCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model =  ThreadPost
        fields = ['title', 'content', 'image']
        
    def validate_title(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('Title must be at least 10 character length')

        return value 
    
    def validate_content(self, value):
        if len(value.strip()) < 20:
            raise serializers.ValidationError('Content must be at least 20 character length')
    
        return value
    