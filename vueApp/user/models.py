from django.db import models

class User(models):
	username = models.CharField('Username', max_length=50, unique=True)
	password = models.CharField('Password', max_length=50)
	...