from django.db import models
from django.contrib.auth.models import User

class ThreadPost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='thread_posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='thread_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)