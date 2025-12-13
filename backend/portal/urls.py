from django.urls import path 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    SignUpView, 
    UserProfileView, 
    UpdateProfileImageView,
    UpdateProfileDetailsView,
    UpdatePasswordView,
    FollowUserView,
    UserFollowersListView,
    UserFollowingListView,
    AllUsersListView,
    OTPVerifyView,
    OTPResendView
)

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signup/verify/', OTPVerifyView.as_view(), name='signup_verify'),  
    path('signup/resend/', OTPResendView.as_view(), name='signup_resend'), 
    path('signin/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/details/', UpdateProfileDetailsView.as_view(), name='update_profile_details'),
    path('profile/password/', UpdatePasswordView.as_view(), name='update_password'),
    path('profile/image/', UpdateProfileImageView.as_view(), name='update_profile_image'),
    path('follow/<str:username>/', FollowUserView.as_view(), name='follow_user'),
    path('followers/<str:username>/', UserFollowersListView.as_view(), name='user_followers'),
    path('following/<str:username>/', UserFollowingListView.as_view(), name='user_following'),
    path('users/', AllUsersListView.as_view(), name='all_users'),
]