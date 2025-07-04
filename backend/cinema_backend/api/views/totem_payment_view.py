from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status
from api.utils import RawSQLHelper


class TotemPaymentView(ViewSet):
    """
    Registers a sale for a session, handling tickets and payments.
    """
    permission_classes = [AllowAny]

    def create(self, request):
        cpf = request.data.get("cpf")  # optional
        session_id = request.data.get("session_id")  # required
        selected_seats = request.data.get("seats")  # list of seats
        payment_method = request.data.get("payment_method")  # required unless only pontos

        if not session_id or not selected_seats:
            return Response({"error": "Session ID and selected seats are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(selected_seats, list) or len(selected_seats) == 0:
            return Response({"error": "Selected seats must be a non-empty list."}, status=status.HTTP_400_BAD_REQUEST)

        total_points_required = 0
        total_monetary_cost = 0

        if cpf:
            client_points_query = "SELECT quantidade_pontos FROM cliente WHERE cpf = %s"
            client_points_result = RawSQLHelper.execute_query(client_points_query, [cpf])
            client_points_balance = client_points_result[0]['quantidade_pontos'] if client_points_result else 0
        else:
            client_points_balance = 0

        # Calcular valores
        for seat in selected_seats:
            ticket_type = seat.get("type")
            if ticket_type == 3:  # pontos
                total_points_required += seat.get("value", 0)
            else:
                total_monetary_cost += seat.get("value", 0)

        if cpf and total_points_required > client_points_balance:
            return Response({"error": "Insufficient points balance."}, status=status.HTTP_400_BAD_REQUEST)

        if total_monetary_cost == 0 and total_points_required > 0:
            payment_method = "pontos"
        elif not payment_method:
            return Response({"error": "Payment method is required unless only points are used."}, status=status.HTTP_400_BAD_REQUEST)

        # Buscar sala_id pela sessão
        session_query = "SELECT sala_id FROM sessao WHERE numero = %s"
        session_result = RawSQLHelper.execute_query(session_query, [session_id])
        if not session_result:
            return Response({"error": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
        poltrona_sala_id = session_result[0]['sala_id']

        # Inserir ingressos
        ticket_insert_query = """
        INSERT INTO ingresso (
            tipo, valor, data, hora, forma_pagamento, cliente_id, sessao_id,
            poltrona_numero, poltrona_letra, poltrona_sala_id
        )
        VALUES (%s, %s, CURRENT_DATE, CURRENT_TIME, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """

        #se não existir um cliente com esse CPF, não insere o cliente_id
        if cpf:
            client_query = "SELECT cpf FROM cliente WHERE cpf = %s"
            client_result = RawSQLHelper.execute_query(client_query, [cpf])
            if not client_result:
                return Response({"error": "Client not found."}, status=status.HTTP_404_NOT_FOUND)
            client_id = client_result[0]['cpf']
        else:
            client_id = None

        ticket_ids = []
        for seat in selected_seats:
            ticket_type = seat.get("type")  # agora é inteiro 1, 2, 3
            ticket_value = seat.get("value")
            poltrona_numero = seat.get("seat_number")
            poltrona_letra = seat.get("seat_letter")

            ticket_result = RawSQLHelper.execute_query(
                ticket_insert_query,
                [
                    ticket_type,
                    ticket_value,
                    payment_method,
                    client_id,
                    session_id,
                    poltrona_numero,
                    poltrona_letra,
                    poltrona_sala_id
                ]
            )
            ticket_ids.append(ticket_result[0]['id'])

        if client_id:
            update_client_points_query = """
            UPDATE cliente
            SET quantidade_pontos = quantidade_pontos + %s - %s
            WHERE cpf = %s
            """
            RawSQLHelper.execute_query(update_client_points_query, [total_monetary_cost, total_points_required, cpf])

        return Response({"message": "Sale registered successfully."}, status=status.HTTP_201_CREATED)
