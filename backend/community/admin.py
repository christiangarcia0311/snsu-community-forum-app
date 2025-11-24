from django.contrib import admin
from .models import (
    CommunityGroup, 
    CommunityMembership, 
    CommunityPost
)

@admin.register(CommunityGroup)
class CommunityGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by', 'member_count', 'is_private', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'created_by__username']
    list_filter = ['is_active', 'is_private', 'created_at']
    readonly_fields = ['created_at', 'updated_at', 'member_count']
    
    fieldsets = (
        ('Community Information', {
            'fields': ('name', 'description', 'image', 'created_by')
        }),
        ('Settings', {
            'fields': ('is_active', 'is_private', 'member_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
@admin.register(CommunityMembership)
class CommunityMembershipAdmin(admin.ModelAdmin):
    list_display = ['user', 'community', 'role', 'joined_at']
    search_fields = ['user__username', 'community__name']
    list_filter = ['role', 'joined_at']
    readonly_fields = ['joined_at']

@admin.register(CommunityPost)
class CommunityPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'community', 'author', 'is_pinned', 'created_at']
    search_fields = ['title', 'content', 'author__username', 'community__name']
    list_filter = ['is_pinned', 'created_at', 'community']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Post Information', {
            'fields': ('community', 'author', 'title', 'content', 'image')
        }),
        ('Settings', {
            'fields': ('is_pinned',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
