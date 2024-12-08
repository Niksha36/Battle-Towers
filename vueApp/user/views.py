import json

from django.contrib.auth import login, authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer, UserLoginSerializer, UpdateUserRecordSerializer


@api_view(['POST'])
def create_user(request):
    if request.method != 'POST':
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    serializer = UserSerializer(data=request.data)
    if not serializer.is_valid():
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    authenticate(request)
    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_user(request):
    if request.method != 'POST':
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    serializer = UserLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    user_l = User.objects.get(username=serializer.data['username'])
    user = serializer.validated_data
    login(request, user)
    return Response({"message": "Login successful", "record": user_l.record}, status=status.HTTP_202_ACCEPTED)

@api_view(['GET'])
def get_top_user(request):
    if request.method != 'GET':
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    users = list(User.objects.all().order_by('-record'))[:5]
    username = request.GET.get('username', None)
    if not username:
        response_body = [
            {
                "place": i + 1,
                "username": usr.username,
                "record": usr.record
            }
            for i, usr in enumerate(users)
        ]
    else:
        user = User.objects.get(username=username)

        if user not in users:
            users.append(user)
        response_body = [
            {
                "place": i + 1,
                "username": usr.username,
                "record": usr.record
            }
            for i, usr in enumerate(users)
        ]

    return Response(data=response_body, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_record(request):
    if request.method != 'GET':
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    username = request.GET.get('username', None)
    if not username:
        return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(user.record, status=status.HTTP_200_OK)

@api_view(['POST'])
def update_user_record(request):
    if request.method != 'POST':
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    username = request.data['params'].get('username', None)
    if not username:
        return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)


    serializer = UpdateUserRecordSerializer(instance=user, data={"record": request.data['params']['record']})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)