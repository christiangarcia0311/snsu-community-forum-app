from django.db import models
from cloudinary.models import CloudinaryField

from django.contrib.auth.models import User
from django.conf import settings

class ThreadPost(models.Model):
    
    THREAD_TYPES = [
        ('general', 'General'),
        ('discussion', 'Discussion'),
        ('question', 'Question'),
        ('guide', 'Guide'),
        ('announcement', 'Announcement'),
        ('accomplishment', 'Accomplishment')
    ]
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='thread_posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = CloudinaryField('thread_image', null=True, blank=True)
    thread_type = models.CharField(max_length=50, choices=THREAD_TYPES, default='General')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.title} - {self.author.username}'
    
    class Meta:
        ordering = ['-created_at']
        
class ThreadComment(models.Model):
    thread = models.ForeignKey('ThreadPost', on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='thread_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Comment by {self.author.username} on {self.thread.id}'
    
class ThreadLike(models.Model):
    thread = models.ForeignKey('ThreadPost', on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='thread_likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('thread', 'user')

    def __str__(self):
        return f'Like by {self.user.username} on {self.thread.id}'