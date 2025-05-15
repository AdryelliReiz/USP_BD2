from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from rest_framework.permissions import AllowAny


class TotemCinemaView(ViewSet):
    permission_classes = [AllowAny]
    def list(self, request):
        query = "SELECT cnpj, nome, rua, n_end FROM cinema"
        client_data = RawSQLHelper.execute_query(query)
        return Response(client_data)
