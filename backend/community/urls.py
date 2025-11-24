from django.urls import path
from .views import (
    CommunityGroupListView,
    CommunityGroupCreateView,
    CommunityGroupDetailView,
    CommunityMembershipView,
    CommunityMembersListView,
    UpdateMemberRoleView,
    CommunityPostListView,
    CommunityPostCreateView,
    CommunityPostDetailView,
    UserCommunitiesView
)


urlpatterns = [
    
    # --- COMMUNITY GROUP ---
    path('groups/', CommunityGroupListView.as_view(), name='community-list'),
    path('groups/create/', CommunityGroupCreateView.as_view(), name='community-create'),
    path('groups/<int:pk>/', CommunityGroupDetailView.as_view(), name='community-detail'),
    path('groups/my-communities/', UserCommunitiesView.as_view(), name='user-communities'),
    
    # --- COMMUNITY MEMBERSHIP ---
    path('groups/<int:pk>/join/', CommunityMembershipView.as_view(), name='community-join'),
    path('groups/<int:pk>/members/', CommunityMembersListView.as_view(), name='community-members'),
    path('groups/<int:pk>/members/<int:member_id>/role/', UpdateMemberRoleView.as_view(), name='update-member-role'),
    
    # --- COMMUNITY POSTS ---
    path('groups/<int:pk>/posts/', CommunityPostListView.as_view(), name='community-posts'),
    path('posts/create/', CommunityPostCreateView.as_view(), name='community-post-create'),
    path('posts/<int:pk>/', CommunityPostDetailView.as_view(), name='community-post-detail'),
]