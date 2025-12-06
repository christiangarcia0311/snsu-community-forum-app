from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Notifications(models.Model):
    
    NOTIFICATION_TYPES = (
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('follow', 'Follow')
    )
    
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
    )