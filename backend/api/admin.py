from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'lastname', 'firstname', 'user__email', 'role', 'course', 'department', 'created_at', 'updated_at']
    search_fields = ['lastname', 'firstname', 'user__email']
    list_filter = ['lastname', 'firstname', 'user__email', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'profile_picture')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
