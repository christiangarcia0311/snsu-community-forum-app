from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login
from .serializers import SignUpSerializer, SignInSerializer

class SignUpView(generics.CreateAPIView):
    serializer_class = SignUpSerializer
    
class SignInView(APIView):
    serializer_class = SignInSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            
            return Response({
                'message': 'Login successful',
                'username': user.username,
                'email': user.email,
            })
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)