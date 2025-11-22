from django.contrib import admin
from .models import ThreadPost

@admin.register(ThreadPost)
class ThreadPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author' , 'created_at', 'updated_at']
    search_fields = ['title', 'author__username']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Thread Post', {
            'fields': ('title', 'content', 'image')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
