from django.contrib import admin
from .models import ThreadPost

@admin.register(ThreadPost)
class ThreadPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author' , 'created_at', 'updated_at']
    search_fields = ['title', 'author__username']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Thread Post', {
            'fields': ('title', 'content', 'image', 'thread_type')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.author = request.user
        super().save_model(request, obj, form, change)
    
