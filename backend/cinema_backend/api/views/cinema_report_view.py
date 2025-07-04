from rest_framework.response import Response
from api.utils import RawSQLHelper
from rest_framework import viewsets
from datetime import datetime, timedelta
from api.permissions import IsAdmin

class CinemaReportView(viewsets.ViewSet):

    permission_classes = [IsAdmin]

    def list(self, request):
        cnpj = request.query_params.get("cinema_cnpj")

         # 1. Faturamento do mes anterior
        last_month = (datetime.now() - timedelta(days=30)).month
        current_year = datetime.now().year
        query_last_month_revenue = """
        SELECT SUM(valor::numeric) AS faturamento_mes_anterior
        FROM ingresso
        LEFT JOIN sessao ON ingresso.sessao_id = sessao.numero
        LEFT JOIN sala ON sessao.sala_id = sala.numero
        LEFT JOIN cinema ON sala.cinema_id = cinema.cnpj
        WHERE EXTRACT(MONTH FROM data) = %s AND EXTRACT(YEAR FROM data) = %s AND cinema.cnpj = %s
        """

        last_month_revenue = RawSQLHelper.execute_query(query_last_month_revenue, [last_month, current_year, cnpj])[0].get('faturamento_mes_anterior', 0)

        # 2. Faturamento do mes atual
        current_month = datetime.now().month
        query_current_month_revenue =  """
        SELECT SUM(valor::numeric) AS faturamento_mes_atual
        FROM ingresso
        LEFT JOIN sessao ON ingresso.sessao_id = sessao.numero
        LEFT JOIN sala ON sessao.sala_id = sala.numero
        LEFT JOIN cinema ON sala.cinema_id = cinema.cnpj
        WHERE EXTRACT(MONTH FROM data) = %s AND EXTRACT(YEAR FROM data) = %s AND cinema.cnpj = %s
        """
        current_month_revenue = RawSQLHelper.execute_query(query_current_month_revenue, [current_month, current_year, cnpj])[0].get('faturamento_mes_atual', 0)


        # 3. Ingressos mais vendidos
        query_top_tickets = """
        SELECT
            CASE
                WHEN tipo = 1 THEN 'meia'
                WHEN tipo = 2 THEN 'inteira'
                WHEN tipo = 3 THEN 'club'
            END AS tipo,
            COUNT(*) AS vendidos
        FROM ingresso
        LEFT JOIN sessao ON ingresso.sessao_id = sessao.numero
        LEFT JOIN sala ON sessao.sala_id = sala.numero
        LEFT JOIN cinema ON sala.cinema_id = cinema.cnpj
        WHERE sessao_id IN (
            SELECT numero FROM sessao WHERE data >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
            AND data < DATE_TRUNC('month', NOW())
        ) AND cinema.cnpj = %s
        GROUP BY tipo
        ORDER BY vendidos DESC
        """
        top_tickets = RawSQLHelper.execute_query(query_top_tickets, [cnpj])

        # 4. Filmes mais vendidos (ativos)
        query_top_movies = """
        SELECT
            f.titulo,
            g.nome AS genero,
            SUM(i.valor_total::numeric) AS faturamento,
            COUNT(DISTINCT se.numero) AS sessoes_exibidas,
            ROUND(
                100.0 * SUM(CASE WHEN i.id IS NOT NULL THEN 1 ELSE 0 END) /
                NULLIF(SUM(sa.qtde_poltronas), 0), 2
            ) AS aproveitamento
        FROM filme f
        LEFT JOIN sessao se ON se.filme_id = f.id AND se.cancelada = FALSE
        LEFT JOIN sala sa ON sa.numero = se.sala_id
        LEFT JOIN ingresso i ON i.sessao_id = se.numero
        LEFT JOIN cinema c ON sa.cinema_id = c.cnpj
        LEFT JOIN genero_filme gf ON gf.filme_id = f.id
        LEFT JOIN genero g ON g.id = gf.genero_id
        WHERE f.fim_contrato IS NULL OR f.fim_contrato > NOW() AND c.cnpj = %s
        GROUP BY f.titulo, g.nome
        ORDER BY faturamento DESC
        """
        top_movies = RawSQLHelper.execute_query(query_top_movies, [cnpj])

        response_data = {
            "faturamento_mes_anterior": last_month_revenue,
            "faturamento_mes_atual": current_month_revenue,
            "ingressos_mais_vendidos": top_tickets,
            "filmes_mais_vendidos": top_movies,
        }

        return Response(response_data, status=200)
