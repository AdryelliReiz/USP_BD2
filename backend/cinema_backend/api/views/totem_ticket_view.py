from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from api.utils import RawSQLHelper

class TotemTicketView(ViewSet):
    """
    Tela de selecao dos ingressos
    """
    permission_classes = [AllowAny]

    def retrieve(self, request, pk):
        """
        GET /sessions/<id>/tickets
        Retrieves ticket types (name, value, type) for a given session ID,
        and the balance of points for the client (if CPF is provided).
        """
        cpf = request.query_params.get('cpf', None)


        ticket_query = """
        SELECT
            tipo,
            valor,
            CASE
                WHEN tipo = 1 THEN 'meia'
                WHEN tipo = 2 THEN 'inteiro'
                WHEN tipo = 3 THEN 'club'
                ELSE 'unknown'
            END AS nome,
            'monetario' AS tipo_pago
        FROM ingresso
        WHERE sessao_id = %s
        """
        ticket_data = RawSQLHelper.execute_query(ticket_query, [pk])

        # Se CPF for cadastrado, verifica os seus pontos
        points_balance = 0
        if cpf:
            client_points_query = """
            SELECT SUM(qtde) AS total_pontos
            FROM pontos
            WHERE cliente_id = %s
            """
            points_result = RawSQLHelper.execute_query(client_points_query, [cpf])
            if points_result:
                points_balance = points_result[0]['total_pontos'] or 0

            # Adiciona os pontos ao cliente se ele tiver o tipo clube/cadastro
            for ticket in ticket_data:
                if ticket['nome'] == 'club':
                    ticket['tipo_pago'] = 'pontos'

        # Retorna os pontos dos clientes e o ticket data
        return Response({
            'pontos': points_balance,
            'ingressos': ticket_data
        })
