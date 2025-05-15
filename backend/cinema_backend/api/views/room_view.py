from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from api.utils import RawSQLHelper
from api.permissions import IsStaffOrAdmin
from rest_framework import viewsets

class RoomView(viewsets.ViewSet):

    permission_classes = [IsStaffOrAdmin]

    def list(self, request):

        cinema_id = request.query_params.get("cinema_id")
        if not cinema_id:
            return Response({"error": "Cinema ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        query = """
        SELECT s.numero AS sala_id,
               s.largura,
               s.profundidade,
               s.suporta_imax,
               s.suporta_3d,
               s.qtde_poltronas,
               (s.largura * s.profundidade) AS total_area
        FROM sala s
        WHERE s.cinema_id = %s AND s.numero > 0  -- Only active rooms
        """

        rooms = RawSQLHelper.execute_query(query, [cinema_id])

        return Response(rooms, status=status.HTTP_200_OK)

    def create(self, request):
        """
        POST /cinema-rooms
        Creates a new cinema room.
        """
        numero = request.data.get("numero")
        cinema_id = request.data.get("cinema_id")
        largura = request.data.get("largura")
        profundidade = request.data.get("profundidade")
        suporta_imax = request.data.get("suporta_imax", False)
        suporta_3d = request.data.get("suporta_3d", False)
        poltronas_ids = request.data.get("poltronas_ids")

        if not numero or not cinema_id or not largura or not profundidade or not poltronas_ids:
            return Response({"error": "Numero da sala, cinema_id, largura, profundidade e IDs das poltronas sao obrigatorios."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create new room
            insert_sala_query = """
            INSERT INTO sala (numero, cinema_id, largura, profundidade, suporta_imax, suporta_3d, qtde_poltronas)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            RawSQLHelper.execute_query(insert_sala_query, [numero, cinema_id, largura, profundidade, suporta_imax, suporta_3d, len(poltronas_ids)])

            # Get the newly created room ID
            room_id = numero  # Sala ID is same as the room number in this case.

            # Link the seats (poltronas) to the room
            for poltrona_id in poltronas_ids:
                insert_poltrona_query = """
                INSERT INTO poltrona (numero, sala_id)
                VALUES (%s, %s)
                """
                RawSQLHelper.execute_query(insert_poltrona_query, [poltrona_id, room_id])

            return Response({"message": "Sala criada com sucesso."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        """
        DELETE /cinema-rooms/<room_id>
        Deletes a room if no session has used it, otherwise marks it as inactive.
        """
        try:
            # Check if any session has used the room
            check_sessions_query = """
            SELECT COUNT(*) FROM sessao WHERE sala_id = %s
            """
            sessions_count = RawSQLHelper.execute_query(check_sessions_query, [pk])[0]["count"]

            if sessions_count > 0:
                # If sessions exist, make the room inactive by changing the room number to negative
                update_room_query = "UPDATE sala SET numero = -%s WHERE numero = %s"
                RawSQLHelper.execute_query(update_room_query, [pk, pk])
                return Response({"message": "Sala inativada com sucesso."}, status=status.HTTP_200_OK)

            # If no sessions used the room, delete it
            delete_room_query = "DELETE FROM sala WHERE numero = %s"
            RawSQLHelper.execute_query(delete_room_query, [pk])
            return Response({"message": "Sala excluida com sucesso."}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
