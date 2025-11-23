from django.db import models

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from django.core.exceptions import ValidationError

class UserProfile(models.Model):
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('faculty', 'Faculty'),
    ]
    
    DEPARTMENT_CHOICES = [
        ('ccis', 'College of Computer and Information Sciences'),
        ('coe', 'College of Engineering'),
        ('cbt', 'College of Business and Technology'),
        ('cas', 'College of Arts and Sciences'),
        ('cte', 'College of Teacher Education'),
    ]
    
    COURSE_CHOICES = [
        ('bscs', 'BS in Computer Science'),
        ('bsit', 'BS in Information Technology'),
        ('bsis', 'BS in Information Systems'),
        ('bscpe', 'BS in Computer Engineering'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    birth_date = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES)
    course = models.CharField(max_length=50, choices=COURSE_CHOICES)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_profile_details_update = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.firstname} {self.lastname}"
    
    def can_update_profile_details(self):
        
        '''UPDATE PROFILE ONCE EVERY 7 DAYS'''
        
        if not self.last_profile_details_update:
            return True
        
        cooldown_period = timedelta(days=7)
        time_since_update = timezone.now() - self.last_profile_details_update
        
        return time_since_update >= cooldown_period
        
    
    def days_until_next_update(self):
        
        '''CALCULATE DAYS UNTIL NEXT UPDATE'''
        
        if not self.last_profile_details_update:
            return 0
        
        cooldown_period = timedelta(days=7)
        time_since_update = timezone.now() - self.last_profile_details_update
        days_remaining = (cooldown_period - time_since_update).days
        
        return max(0, days_remaining)
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

class UserFollow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
        verbose_name = 'User Follow'
        verbose_name_plural = 'User Follows'
    
    def __str__(self):
        return f'{self.follower.username} follows {self.following.username}'

    def clean(self):
        if self.follower == self.following:
            raise ValidationError('Users cannot follow themselves')
