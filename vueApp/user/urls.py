from django.urls import path
from .views import *

app_name = 'user'

urlpatterns = [
    path('create_user', create_user, name='create_user'),
    path('get_user', get_user, name='get_user'),
]