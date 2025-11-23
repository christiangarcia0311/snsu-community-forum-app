from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class CommunityGroup(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='community_banner_images/', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_communities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # -- COMMUNITY SETTINGS --
    is_private = models.BooleanField(default=False)
    member_count = models.IntegerField(default=0)