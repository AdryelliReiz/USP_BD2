from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from rest_framework.permissions import AllowAny


class TotemMovieView(ViewSet):
    permission_classes = [AllowAny]
    def retrieve(self, request, pk):

        query = """
                SELECT
                    se.data AS date,
                    f.id AS film_id,
                    f.titulo,
                    f.ano,
                    f.diretor,
                    f.class_ind,
                    f.idioma,
                    f.duracao,
                    f.eh_dub,
                    f.fim_contrato,
                    f.descricao,
                    array_agg(se.hora) AS sessions
                FROM
                    sessao AS se
                INNER JOIN
                    sala AS sa ON se.sala_id = sa.numero
                INNER JOIN
                    filme AS f ON se.filme_id = f.id
                WHERE
                    sa.cinema_id = %s
                GROUP BY
                    se.data, f.id, f.titulo, f.ano, f.diretor, f.class_ind, f.idioma, f.duracao, f.eh_dub, f.fim_contrato, f.descricao
                ORDER BY
                    se.data ASC, f.id;
        """
        client_data = RawSQLHelper.execute_query(query, [pk])

        return Response(client_data)
