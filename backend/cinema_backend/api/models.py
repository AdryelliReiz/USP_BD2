from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Create a User dummy for autorization
class User(AbstractBaseUser):
    EMPLOYEE = 0
    STAFF = 1
    ADMIN = 2
    ROLE_CHOICES = (
        (EMPLOYEE, 'employee'),
        (STAFF, 'staff'),
        (ADMIN, 'admin'),
    )

    email = models.CharField(unique=True, max_length=255)
    # senha = models.CharField(max_length=112)
    role = models.CharField(choices=ROLE_CHOICES, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
