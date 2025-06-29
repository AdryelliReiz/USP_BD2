from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from api.utils import RawSQLHelper
from api.permissions import IsStaffOrAdmin
from rest_framework import viewsets

class RoomView(viewsets.ViewSet):

    permission_classes = [IsStaffOrAdmin]

    def list(self, request):
        cnpj = request.query_params.get("cnpj")
        data = request.query_params.get("data")
        horario = request.query_params.get("horario")
        filme_id = request.query_params.get("filme_id")

        if not cnpj:
            return Response({"error": "Cinema ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        params = [cnpj]
        filter_sessions = ""
        join_filme = ""
        select_extra = ""

        if data and horario and filme_id:
            # Get the duration of the movie
            dur_query = "SELECT duracao FROM filme WHERE id = %s AND fim_contrato IS NULL"
            dur_result = RawSQLHelper.execute_query(dur_query, [filme_id])
            if not dur_result:
                return Response({"error": "Filme não encontrado."}, status=status.HTTP_400_BAD_REQUEST)
            duracao = dur_result[0]["duracao"]

            # Filter out rooms that have a session overlapping with the given date/time and movie duration
            filter_sessions = """
            AND s.numero NOT IN (
                SELECT se.sala_id
                FROM sessao se
                WHERE se.data = %s
                  AND (
                        (se.horario <= %s AND (se.horario + INTERVAL '1 minute' * %s) > %s)
                     OR (se.horario >= %s AND se.horario < (%s::time + INTERVAL '1 minute' * %s))
                  )
            )
            """
            params.extend([data, horario, duracao, horario, horario, horario, duracao])

        query = f"""
        SELECT s.numero AS sala_id,
               s.suporta_3d
        FROM sala s
        WHERE s.cinema_id = %s
        {filter_sessions}
        ORDER BY (s.numero > 0) DESC, s.numero
        """

        rooms = RawSQLHelper.execute_query(query, params)
        return Response(rooms, status=status.HTTP_200_OK)

    def create(self, request):
        """
        POST /cinema-rooms
        Creates a new cinema room.
        The 'poltronas_ids' field is a list of seat identifiers (e.g., 'A1', 'B2') that will be created as PCD seats.
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

            # Link the seats (poltronas) to the room as PCD seats
            for poltrona_id in poltronas_ids:
                insert_poltrona_query = """
                INSERT INTO poltrona (numero, sala_id, pcd)
                VALUES (%s, %s, %s)
                """
                RawSQLHelper.execute_query(insert_poltrona_query, [poltrona_id, room_id, True])

            return Response({"message": "Sala criada com sucesso."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        """
        PUT /cinema-rooms/<room_id>
        Updates the 'eh_ativo' status of a room (activate or deactivate).
        Expects a JSON body with {"eh_ativo": true/false}.
        """
        eh_ativo = request.data.get("eh_ativo")
        if eh_ativo is None:
            return Response({"error": "'eh_ativo' field is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            update_query = "UPDATE sala SET eh_ativo = %s WHERE numero = %s"
            RawSQLHelper.execute_query(update_query, [eh_ativo, pk])
            return Response({"message": "Status da sala atualizado com sucesso."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
