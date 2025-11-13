from django.urls import path 
from .views import SignUpView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('signin/', SignInView.as_view(), name='signin'),
]