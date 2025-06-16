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
        query = self.new_method()
        seat_data = RawSQLHelper.execute_query(query, [pk])
        return Response(seat_data)

    def new_method(self):
        query = """
        SELECT poltrona.letra, poltrona.numero, poltrona.tipo,
        CASE
            WHEN ingresso.id IS NOT NULL THEN TRUE
            ELSE FALSE
        END AS ocupada
        FROM poltrona
        JOIN sala ON poltrona.sala_id = sala.numero
        JOIN sessao ON sessao.sala_id = sala.numero
        LEFT JOIN ingresso ON ingresso.sessao_id = sessao.numero
            AND ingresso.poltrona_letra = poltrona.letra
            AND ingresso.poltrona_numero = poltrona.numero
            AND ingresso.poltrona_sala_id = poltrona.sala_id
        WHERE sessao.numero = %s
        """
        
        return query
