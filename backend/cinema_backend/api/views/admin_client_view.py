from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from api.permissions import IsStaffOrAdmin

class AdminClientView(ViewSet):
    permission_classes = [IsStaffOrAdmin]
    def list(self, request):
        query = "SELECT * FROM cliente WHERE email LIKE %s"
        client_data = RawSQLHelper.execute_query(query, ["%marcia%"])
        print(client_data)
        return Response(client_data)
