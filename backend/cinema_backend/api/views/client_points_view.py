from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from rest_framework import status
class ClientPointsView(ViewSet):
    """
    Retrieves last point score and point history.
    """
    def retrieve(self, request, pk):
        scoreQuery = """
        SELECT quantidade_pontos
        FROM cliente
        WHERE cpf = %s
        """

        score = RawSQLHelper.execute_query(scoreQuery, [pk])

        historyQuery = """
        SELECT id, data, hora, tipo, valor
        FROM ingresso
        WHERE cliente_id = %s
        ORDER BY data DESC, hora DESC
        """

        historyList = RawSQLHelper.execute_query(historyQuery, [pk])

        response = {
            "score": score[0]['quantidade_pontos'] if score else 0,
            "history": historyList
        }

        return Response(response, status=status.HTTP_200_OK)
