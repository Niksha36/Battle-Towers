from django.http import JsonResponse
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .serializers import UserSerializer, UserLoginSerializer, UpdateUserRecordSerializer
from django.contrib.auth import get_user_model
from rest_framework import status, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import login
from .models import User
import json


@api_view(['POST'])
def create_user(request):
    if request.method != 'POST':
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    serializer = UserSerializer(data=request.data)
    if not serializer.is_valid():
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    login(request, user)
    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_user(request):
    if request.method != 'POST':
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    serializer = UserLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.validated_data
    login(request, user)
    return Response({"message": "Login successful"}, status=status.HTTP_202_ACCEPTED)

@api_view(['GET'])
def get_top_user(request):
    if request.method != 'GET':
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    users = User.objects.all().order_by('-record').limit(10)
    user = User.objects.get(pk=request.user.id)

    if user not in users:
        users += user
    response_body = [
        {
            "place": i + 1,
            "username": usr.username,
            "record": usr.record
        }
        for i, usr in enumerate(users)
    ]

    return Response(response_body, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_record(request):
    if request.method != 'GET':
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    username = request.GET.get('username', None)
    if not username:
        return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
    data = json.loads(request.body.decode())
    try:
        user = User.objects.get(username=data['username'])
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UpdateUserRecordSerializer(instance=user, data=data)
    serializer.save()
