from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkAsReadView,
    NotificationMarkAllAsReadView,
    NotificationDeleteView
)

urlpatterns = [
    path('content/', NotificationListView.as_view(), name='notification-list'),
    path('content/<int:pk>/read/', NotificationMarkAsReadView.as_view(), name='notification-mark-read'),
    path('content/read-all/', NotificationMarkAllAsReadView.as_view(), name='notification-mark-all-read'),
    path('content/<int:pk>/delete/', NotificationDeleteView.as_view(), name='notification-delete'),
] 