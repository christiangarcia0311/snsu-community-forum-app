from django.db import models
from cloudinary.models import CloudinaryField

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class CommunityGroup(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    image = CloudinaryField('community_banner_image', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_communities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # -- COMMUNITY SETTINGS --
    is_private = models.BooleanField(default=False)
    member_count = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Community Group'
        verbose_name_plural = 'Community Groups'
        
class CommunityMembership(models.Model):
    
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('moderator', 'moderator'),
        ('admin', 'Admin')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_memberships')
    community = models.ForeignKey(CommunityGroup, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.user.username} - {self.community.name} ({self.role})'
    
    class Meta:
        unique_together = ('user', 'community')
        ordering = ['-joined_at']
        verbose_name = 'Community Membership'
        verbose_name_plural = 'Community Memberships'
        

class CommunityPost(models.Model):
    
    community = models.ForeignKey(CommunityGroup, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = CloudinaryField('community_post_image', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_pinned = models.BooleanField(default=False)
    
    def __str__(self):
        return f'{self.title} - {self.community.name}'
    
    class Meta:
        ordering = ['-is_pinned', '-created_at']
        verbose_name = 'Community Post'
        verbose_name_plural = 'Community Posts'
    