from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from api.utils import RawSQLHelper
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

class ClientOrderView(ViewSet):
    """
    Retrieves a pk client order history.
    """
    def retrieve(self, request, pk):

        orderQuery = """
        SELECT I.data, C.nome, F.titulo, I.tipo
        FROM ingresso as I
        INNER JOIN pertence AS P
        ON I.id = P.ingresso_id
        INNER JOIN sessao AS S
        ON P.sessao_n = S.numero
        INNER JOIN filme AS F
        ON F.id = S.filme_id
        INNER JOIN sala AS L
        ON S.sala_id = L.numero
        INNER JOIN cinema AS C
        ON L.cinema_id = C.cnpj
        WHERE
        I.cliente_id = %s
        """

        orderQueryList = RawSQLHelper.execute_query(orderQuery, [pk])

        return Response(orderQueryList);
