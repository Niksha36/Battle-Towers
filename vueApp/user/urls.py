from django.urls import path
from .views import *

app_name = 'user'

urlpatterns = [
    path('create_user', create_user, name='create_user'),
    path('login_user', login_user, name='login_user'),
]