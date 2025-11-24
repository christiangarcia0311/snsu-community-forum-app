from django.urls import path
from .views import (
    ThreadPostListView,
    ThreadPostDetailView,
    UserThreadPostsView,
    ThreadPostCreateView,
    ThreadCommentListCreateView,
    ThreadLikeToggleView
)

urlpatterns = [
    path('posts/', ThreadPostListView.as_view(), name='thread-list'),
    path('my-posts/', UserThreadPostsView.as_view(), name='user-thread'),
    path('create/', ThreadPostCreateView.as_view(), name='thread-create'),
    path('posts/<int:pk>/', ThreadPostDetailView.as_view(), name='thread-details'),
    path('posts/<int:pk>/comments/', ThreadCommentListCreateView.as_view(), name='thread-comments'),
    path('posts/<int:pk>/like/', ThreadLikeToggleView.as_view(), name='thread-like')
]
