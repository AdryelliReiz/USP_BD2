from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from rest_framework.permissions import AllowAny

class TotemSessionView(ViewSet):
    permission_classes = [AllowAny]
    def retrieve(self, request, pk):
        date = request.data.get("data")

        query = """
        SELECT
            f.id,
            f.titulo,
            f.duracao,
            f.class_ind,
            f.descricao,
            s.numero AS sala_numero,
            s.numero AS sessao_numero,
            sa.suporta_3d,
            sa.suporta_imax,
            sa.leg_ou_dub
        FROM sessao AS s
        INNER JOIN filme AS f ON s.filme_id = f.id
        INNER JOIN sala AS sa ON s.sala_id = sa.numero
        WHERE s.numero = %s AND s.data = %s
        ORDER BY sa.numero, s.leg_ou_dub, s.hora
        """

        client_data = RawSQLHelper.execute_query(query, [pk, date])
        return Response(client_data)
