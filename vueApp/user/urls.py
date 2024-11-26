from django.urls import path
from .views import *

app_name = 'user'

urlpatterns = [
    path('create_user', create_user, name='create_user'),
    path('login_user', login_user, name='login_user'),
    path('get_top', get_top_user, name='get_top'),
    path('get_user_record', get_user_record, name='get_user_record'),
    path('update_user_record', update_user_record, name='update_user_record'),
]