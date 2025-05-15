from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model
from .models import User as UserType

class IsStaffOrAdmin(BasePermission):
    """
    Custom permission to only allow staff or admin users.
    """
    def has_permission(self, request, view) -> bool: #type: ignore
        User:UserType = get_user_model()  # Retrieve the custom User model
        user = request.user
        # Check if the user is authenticated and has a role of STAFF or ADMIN
        return user.is_authenticated and user.role in [User.ROLE_CHOICES[User.STAFF][1], User.ROLE_CHOICES[User.ADMIN][1]]

class IsAdmin(BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view) -> bool: #type: ignore
        User:UserType = get_user_model()  # Retrieve the custom User model
        user = request.user
        # Check if the user is authenticated and has a role of STAFF or ADMIN
        return user.is_authenticated and user.role in User.ROLE_CHOICES[User.ADMIN][1]
