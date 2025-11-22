from django.urls import path
from .views import (
    ThreadPostListView,
    ThreadPostDetailView,
    UserThreadPostsView,
    ThreadPostCreateView
)

urlpatterns = [
    path('posts/', ThreadPostListView.as_view(), name='thread-list'),
    path('my-posts/', UserThreadPostsView.as_view(), name='user-thread'),
    path('create/', ThreadPostCreateView.as_view(), name='thread-create'),
    path('posts/<int:pk>/', ThreadPostDetailView.as_view(), name='thread-details')
]
