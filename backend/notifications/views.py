from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(APIView):
    
    '''API endpoint to list all notifications for authenticated user'''
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user)
        serializer = NotificationSerializer(notifications, many=True, context={'request': request})
        
        unread_count = notifications.filter(is_read=False).count()
        
        return Response({
            'notifications': serializer.data,
            'unread_count': unread_count
        }, status=status.HTTP_200_OK)
        
class NotificationMarkAsReadView(APIView):
    
    '''API endpoint to mark as read notification'''
    
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, recipient=request.user)
            notification.is_read = True
            notification.save()
            
            serializer = NotificationSerializer(notification, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Notification.DoesNotExist:
            return Response({
                'error': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
class NotificationMarkAllAsReadView(APIView):
    
    '''API endpoint to mark all as read notification'''
    
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        notifications = Notification.objects.filter(recipient=request.user, is_read=False)
        notifications.update(is_read=True)
        
        return Response({
            'message': 'All notifications marked as read',
            'updated_count': notifications.count()
        }, status=status.HTTP_200_OK)
        
class NotificationDeleteView(APIView):
    
    '''API endpoint to delete a notification'''
    
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, recipient=request.user)
            notification.delete()
            
            return Response({
                'message': 'Notification deleted'
            }, status=status.HTTP_200_OK)
            
        except Notification.DoesNotExist:
            return Response({
                'error': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)