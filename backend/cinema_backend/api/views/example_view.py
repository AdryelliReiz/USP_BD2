from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from api.permissions import IsStaffOrAdmin, IsAdmin

from django.contrib.auth.hashers import make_password

class ExampleView(ViewSet):
    permission_classes = [IsAdmin]

    # GET /cinemas
    def list(self, request):
        query = "SELECT * FROM cinema"
        client_data = RawSQLHelper.execute_query(query)
        # print(make_password("123"))
        return Response(client_data)

    # GET /cinemas/<id>
    def retrieve(self, request, pk=None):
        query = "SELECT * FROM cinema WHERE id = %s"
        client_data = RawSQLHelper.execute_query(query, [pk])
        return Response(client_data)
