from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from api.utils import RawSQLHelper

class TotemSeatView(ViewSet):
    """
    Tela de selecao dos assentos de uma sessao
    """
    permission_classes = [AllowAny]

    def retrieve(self, request, pk):
        query = """
        SELECT poltrona.letra, poltrona.numero, poltrona.tipo,
        CASE
        WHEN pertence.ingresso_id IS NOT NULL THEN TRUE
        ELSE FALSE
        END AS ocupada
        FROM poltrona
        JOIN sala ON poltrona.sala_id = sala_numero
        JOIN sessao ON sessao.sala_id = sala_numero
        LEFT JOIN pertence ON pertence.poltrona_n = poltrona.numero
        AND pertence.poltrona_l = poltrona.letra
        AND pertence.sala_id = poltrona.sala.id
        AND pertence.sessao_n = sessao.numero
        WHERE sessao.numero = %s
        """
        seat_data = RawSQLHelper.execute_query(query, [pk])
        return Response(seat_data)
