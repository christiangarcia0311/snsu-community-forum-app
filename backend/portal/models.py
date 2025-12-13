from django.db import models
from cloudinary.models import CloudinaryField

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
        ('ccis', 'College of Computing and Information Sciences'),
        ('coe', 'College of Engineering'),
        ('cbt', 'College of Business and Technology'),
        ('cas', 'College of Arts and Sciences'),
        ('cte', 'College of Teacher Education'),
    ]
    
    COURSE_CHOICES = [
        # CCIS
        ('bscs', 'Bachelor of Science in Computer Science'),
        ('bsit', 'Bachelor of Science in Information Technology'),
        ('bsis', 'Bachelor of Science in Information Systems'),

        # COE
        ('bsce', 'Bachelor of Science in Civil Engineering'),
        ('bsee', 'Bachelor of Science in Electrical Engineering'),
        ('bsece', 'Bachelor of Science in Electronics and Engineering'),
        ('bscpe', 'Bachelor of Science in Computer Engineering'),

        # CBT
        ('bet', 'Bachelor of Engineering Technology'),
        ('baet', 'Bachelor of Automotive Engineering Technology'),
        ('beet', 'Bachelor of Electrical Engineering Technology'),
        ('bexet', 'Bachelor of Electronics Engineering Technology'),
        ('bmet', 'Bachelor of Mechanical Engineering Technology'),
        ('bmet-mt', 'BMET - Mechanical Technology'),
        ('bmet-ract', 'BMET - Refrigeration and Air-conditioning Technology'),
        ('bmet-waft', 'BMET - Welding and Fabrication Technology'),
        ('bit', 'Bachelor in Industrial Technology '),
        ('bit-adt', 'Architectural Drafting'),
        ('bit-at', 'Automotive Technology'),
        ('bit-elt', 'Electrical Technology'),
        ('bit-elex', 'Electronics Technology'),
        ('bit-mt', 'Mechanical Technology'),
        ('bit-hvacr', 'Heating, Ventilating & Air-Conditioning technology'),
        ('bit-waft', 'Welding & Fabrication Technology'),
        ('bshm', 'Bachelor of Science in Hospitality Management'),
        ('bsmt', 'Bachelor of Science in Tourism Management'),
        
        # CAS
        ('bsm', 'Bachelor of Science in Mathematics'),
        ('bses', 'Bachelor of Science in Environmental Science'),
        ('bael', 'Bachelor of Arts in English Language'),
        
        # CTE
        ('beed', 'Bachelor of Elementary Education'),
        ('bsed', 'Bachelor of Secondary Education'),
        ('bped', 'Bachelor of Physical Education'),
        ('btvted', 'Bachelor of Technical-Vocational Teacher Education'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    birth_date = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES)
    course = models.CharField(max_length=50, choices=COURSE_CHOICES)
    profile_image = CloudinaryField('profile_image', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_profile_details_update = models.DateTimeField(null=True, blank=True)
    # track last time password was changed separately
    last_password_change = models.DateTimeField(null=True, blank=True)
    
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

    def can_change_password(self):
        """
        Allow password change once every 14 days.
        """
        if not self.last_password_change:
            return True

        cooldown_period = timedelta(days=14)
        time_since_change = timezone.now() - self.last_password_change
        return time_since_change >= cooldown_period

    def days_until_password_change(self):
        """
        Days remaining until next allowed password change.
        """
        if not self.last_password_change:
            return 0

        cooldown_period = timedelta(days=14)
        time_since_change = timezone.now() - self.last_password_change
        days_remaining = (cooldown_period - time_since_change).days
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

class UserOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user')
    # secret used by pyotp (base32)
    secret = models.CharField(max_length=128, blank=True, null=True)
    # optional last generated code (not required for TOTP verification)
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f'OTP for {self.user.username} (verified={self.is_verified})'