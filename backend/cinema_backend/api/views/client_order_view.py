from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from rest_framework import status

class ClientOrderView(ViewSet):
    """
    Retrieves a pk client order history.
    """
    def retrieve(self, request, pk):

        orderQuery = """
        SELECT I.id, I.data, I.hora C.nome as nome_cinema, F.titulo as nome_filme, I.tipo, I.valor, S.sala_id, I.poltrona_numero, I.poltrona_letra
        FROM ingresso as I
        INNER JOIN sessao AS S
        ON I.sessao_id = S.numero
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

        return Response(orderQueryList, status=status.HTTP_200_OK);
