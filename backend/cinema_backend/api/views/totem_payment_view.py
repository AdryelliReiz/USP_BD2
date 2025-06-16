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
        """
        POST /payments
        Registers a sale for a session, given the client CPF (optional), session ID, selected seats, and payment method.
        """
        cpf = request.data.get("cpf")  # Client CPF (nullable)
        session_id = request.data.get("session_id")  # Session ID
        selected_seats = request.data.get("seats")  # List of seats with ID, value, and ticket type
        payment_method = request.data.get("payment_method")  # Payment method (Pix, credit card, debit, points, null)

        if not session_id or not selected_seats:
            return Response({"error": "Session ID and selected seats are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the selected seats
        if not isinstance(selected_seats, list) or len(selected_seats) == 0:
            return Response({"error": "Selected seats must be a non-empty list."}, status=status.HTTP_400_BAD_REQUEST)

        # Check client points if CPF is provided
        total_points_required = 0
        total_monetary_cost = 0
        if cpf:
            client_points_query = """
            SELECT quantidade_pontos FROM cliente
            WHERE cpf = %s
            """
            client_points_result = RawSQLHelper.execute_query(client_points_query, [cpf])
            client_points_balance = client_points_result[0]['quantidade_pontos'] if client_points_result else 0

        # Calculate total costs and validate ticket types
        for seat in selected_seats:
            if seat.get("type") == "pontos":
                total_points_required += seat.get("value", 0)
            else:
                total_monetary_cost += seat.get("value", 0)

        # Check points balance if applicable
        if cpf and total_points_required > client_points_balance:
            return Response({"error": "Insufficient points balance."}, status=status.HTTP_400_BAD_REQUEST)

        # Force payment method to "pontos" if only points are used
        if total_monetary_cost == 0 and total_points_required > 0:
            payment_method = "pontos"
        elif not payment_method:
            return Response({"error": "Payment method is required unless only points are used."}, status=status.HTTP_400_BAD_REQUEST)

        # Insert data into 'ingresso' table (no more 'pertence' table)
        ticket_insert_query = """
        INSERT INTO ingresso (
            tipo, valor, data, hora, forma_pagamento, cliente_id, sessao_id,
            poltrona_numero, poltrona_letra, poltrona_sala_id
        )
        VALUES (%s, %s, CURRENT_DATE, CURRENT_TIME, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """
        ticket_ids = []
        for seat in selected_seats:
            ticket_type = 1 if seat.get("type") == "meia" else 2 if seat.get("type") == "inteiro" else 3
            ticket_value = seat.get("value")
            poltrona_numero = seat.get("seat_number")
            poltrona_letra = seat.get("seat_letter")
            poltrona_sala_id = seat.get("sala_id")
            ticket_result = RawSQLHelper.execute_query(
            ticket_insert_query,
            [
                ticket_type,
                ticket_value,
                payment_method,
                cpf,
                session_id,
                poltrona_numero,
                poltrona_letra,
                poltrona_sala_id
            ]
            )
            ticket_ids.append(ticket_result[0]['id'])

        if cpf:
            # Update the client's points balance: add total_monetary_cost and subtract total_points_required
            update_client_points_query = """
            UPDATE cliente
            SET quantidade_pontos = quantidade_pontos + %s - %s
            WHERE cpf = %s
            """
            RawSQLHelper.execute_query(update_client_points_query, [total_monetary_cost, total_points_required, cpf])

        return Response({"message": "Sale registered successfully."}, status=status.HTTP_201_CREATED)
