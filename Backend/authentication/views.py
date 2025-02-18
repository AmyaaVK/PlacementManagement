from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser

@api_view(['POST'])
def login_user(request):
    
    """Authenticate user using email and password."""
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Get user by email
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Authenticate user using email as the username
    user = authenticate(request, email=email, password=password)

    if user is not None:
        login(request, user)
        return Response({'message': 'Login successful', 'email': user.email, 'role': user.role}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def register_user(request):
    """Register a new user."""
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')

    if not email or not password or not role:
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email=email).exists():
        return Response({'error': 'Email is already in use'}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects.create_user(email=email, password=password, role=role)
    
    return Response({'message': 'User registered successfully', 'email': user.email, 'role': user.role}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_user_profile(request):
    """Retrieve user profile details."""
    if request.user.is_authenticated:
        return Response({'email': request.user.email, 'role': request.user.role}, status=status.HTTP_200_OK)
    return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

