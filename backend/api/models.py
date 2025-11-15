from django.db import models
from django.contrib.auth.models import User

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
    
    def __str__(self):
        return f"{self.user.username} - {self.firstname} {self.lastname}"
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
