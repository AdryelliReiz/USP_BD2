from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from rest_framework.permissions import AllowAny
from rest_framework import status


class TotemSessionView(ViewSet):
    permission_classes = [AllowAny]

    def retrieve(self, request, pk):  # pk é o filme_id
        cnpj = request.query_params.get("cnpj")
        date = request.query_params.get("data")

        if not all([cnpj, date]):
            return Response({"detail": "Missing 'cnpj' or 'data'."}, status=status.HTTP_400_BAD_REQUEST)

        query = """
            SELECT
                f.id AS filme_id,
                f.titulo,
                f.duracao,
                f.class_ind,
                f.descricao,
                f.cartaz,
                sa.numero AS sala_numero,
                s.numero AS sessao_id,
                s.eh_3d,
                sa.suporta_imax,
                s.leg_ou_dub,
                s.hora
            FROM sessao AS s
            INNER JOIN filme AS f ON s.filme_id = f.id
            INNER JOIN sala AS sa ON s.sala_id = sa.numero
            WHERE f.id = %s AND sa.cinema_id = %s AND s.data = %s AND s.cancelada = FALSE
            ORDER BY sa.numero, s.leg_ou_dub, s.hora
        """

        sessions = RawSQLHelper.execute_query(query, [pk, cnpj, date])

        if not sessions:
            return Response({"detail": "No sessions found."}, status=status.HTTP_404_NOT_FOUND)

        # Dados do filme (pegamos do primeiro registro)
        movie_info = {
            "id": sessions[0]["filme_id"],
            "titulo": sessions[0]["titulo"],
            "duracao": sessions[0]["duracao"],
            "class_ind": sessions[0]["class_ind"],
            "descricao": sessions[0]["descricao"],
            "cartaz": sessions[0].get("cartaz")
        }

        # Agrupando por sala
        sessions_by_room = {}
        for s in sessions:
            sala = s["sala_numero"]
            key = str(sala)
            if key not in sessions_by_room:
                sessions_by_room[key] = {
                    "sala": sala,
                    "e3D": s["eh_3d"],
                    "dub": s["leg_ou_dub"],
                    "imax": s["suporta_imax"],
                    "session": []
                }
            sessions_by_room[key]["session"].append({
                "hora": s["hora"].strftime("%H:%M"),
                "session_id": s["sessao_id"]
            })

        result = {
            "movie": movie_info,
            "sessions_by_room": list(sessions_by_room.values())
        }

        return Response(result, status=status.HTTP_200_OK)
