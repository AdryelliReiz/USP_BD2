from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from rest_framework import viewsets
from datetime import datetime, timedelta
from api.permissions import IsAdmin

class CinemaReportView(viewsets.ViewSet):

    permission_classes = [IsAdmin]

    def get(self, request):

         # 1. Faturamento do mes anterior
        last_month = (datetime.now() - timedelta(days=30)).month
        current_year = datetime.now().year
        query_last_month_revenue = """
        SELECT SUM(valor_total::numeric) AS faturamento_mes_anterior
        FROM ingresso
        WHERE EXTRACT(MONTH FROM data) = %s AND EXTRACT(YEAR FROM data) = %s
        """

        last_month_revenue = RawSQLHelper.execute_query(query_last_month_revenue, [last_month, current_year])[0].get('faturamento_mes_anterior', 0)

        # 2. Faturamento do mes atual
        current_month = datetime.now().month
        query_current_month_revenue =  """
        SELECT SUM(valor_total::numeric) AS faturamento_mes_atual
        FROM ingresso
        WHERE EXTRACT(MONTH FROM data) = %s AND EXTRACT(YEAR FROM data) = %s
        """
        current_month_revenue = RawSQLHelper.execute_query(query_current_month_revenue, [current_month, current_year])[0].get('faturamento_mes_atual', 0)

        # 3. Faturamento por cinema
        query_cinema_revenue = """
        SELECT
            c.cnpj,
            c.nome,
            COALESCE(SUM(i.valor_total::numeric), 0) AS faturamento
        FROM cinema c
        LEFT JOIN sala s ON s.cinema_id = c.cnpj
        LEFT JOIN sessao se ON se.sala_id = s.numero
        LEFT JOIN pertence p ON p.sessao_n = se.numero
        LEFT JOIN ingresso i ON i.id = p.ingresso_id
        GROUP BY c.cnpj, c.nome
        ORDER BY faturamento DESC
        """
        cinema_revenues = RawSQLHelper.execute_query(query_cinema_revenue)

        # 4. Ingressos mais vendidos
        query_top_tickets = """
        SELECT
            CASE
                WHEN tipo = 0 THEN 'Meia'
                WHEN tipo = 1 THEN 'Inteiro'
                ELSE 'Club'
            END AS tipo_ingresso,
            COUNT(*) AS vendidos
        FROM ingresso
        GROUP BY tipo
        ORDER BY vendidos DESC
        """
        top_tickets = RawSQLHelper.execute_query(query_top_tickets)

        # 5. Filmes mais vendidos (ativos)
        query_top_movies = """
        SELECT
            f.titulo,
            g.nome AS genero,
            SUM(i.valor_total::numeric) AS faturamento,
            COUNT(DISTINCT se.numero) AS sessoes_exibidas,
            ROUND(
                100.0 * SUM(CASE WHEN p.ingresso_id IS NOT NULL THEN 1 ELSE 0 END) /
                NULLIF(SUM(sa.qtde_poltronas), 0), 2
            ) AS aproveitamento
        FROM filme f
        LEFT JOIN sessao se ON se.filme_id = f.id
        LEFT JOIN sala sa ON sa.numero = se.sala_id
        LEFT JOIN pertence p ON p.sessao_n = se.numero
        LEFT JOIN ingresso i ON i.id = p.ingresso_id
        LEFT JOIN genero_filme gf ON gf.filme_id = f.id
        LEFT JOIN genero g ON g.id = gf.genero_id
        WHERE f.fim_contrato IS NULL OR f.fim_contrato > NOW()
        GROUP BY f.titulo, g.nome
        ORDER BY faturamento DESC
        """
        top_movies = RawSQLHelper.execute_query(query_top_movies)

        response_data = {
            "faturamento_mes_anterior": last_month_revenue,
            "faturamento_mes_atual": current_month_revenue,
            "faturamento_por_cinema": cinema_revenues,
            "ingressos_mais_vendidos": top_tickets,
            "filmes_mais_vendidos": top_movies,
        }

        return Response(response_data, status=200)
