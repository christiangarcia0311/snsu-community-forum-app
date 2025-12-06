from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_first_name = serializers.SerializerMethodField()
    sender_last_name = serializers.SerializerMethodField()
    sender_profile_image = serializers.SerializerMethodField()
    thread_title = serializers.CharField(source='thread.title', read_only=True, allow_null=True)
    thread_id = serializers.IntegerField(source='thread.id', read_only=True, allow_null=True)
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'recipient',
            'sender',
            'sender_username',
            'sender_first_name',
            'sender_last_name',
            'sender_profile_image',
            'notification_type',
            'thread',
            'thread_id',
            'thread_title',
            'comment',
            'message',
            'is_read',
            'created_at'
        ]
        read_only_fields = ['recipient', 'sender', 'created_at']
    
    def get_sender_first_name(self, obj):
 
        if hasattr(obj.sender, 'profile'):
            return obj.sender.profile.firstname
        return obj.sender.first_name or ''
    
    def get_sender_last_name(self, obj):
    
        if hasattr(obj.sender, 'profile'):
            return obj.sender.profile.lastname
        return obj.sender.last_name or ''
    
    def get_sender_profile_image(self, obj):
  
        if hasattr(obj.sender, 'profile') and obj.sender.profile.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.sender.profile.profile_image.url)
        return None