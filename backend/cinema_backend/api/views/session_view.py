from django.db import connection
from rest_framework.response import Response
from rest_framework import viewsets

class SessionView(viewsets.ViewSet):
    def list(self, request):
        return
