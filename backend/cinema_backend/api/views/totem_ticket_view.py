from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status
from api.utils import RawSQLHelper
from decimal import Decimal, ROUND_HALF_UP
import datetime

class TotemTicketView(ViewSet):
    """
    Tela de seleção dos ingressos
    """
    permission_classes = [AllowAny]

    def retrieve(self, request, pk):
        cpf = request.query_params.get("cpf")

        # Busca dados da sessão e da sala associada
        session_query = """
            SELECT
                s.eh_3d,
                s.leg_ou_dub,
                s.data,
                sa.suporta_imax
            FROM sessao AS s
            INNER JOIN sala AS sa ON s.sala_id = sa.numero
            WHERE s.numero = %s
        """
        session_result = RawSQLHelper.execute_query(session_query, [pk])

        if not session_result:
            return Response({"detail": "Sessão não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        session_data = session_result[0]
        is_3d = session_data["eh_3d"]
        is_imax = session_data["suporta_imax"]
        session_date = session_data["data"]

        # Verifica se data é string ou date
        if isinstance(session_date, str):
            session_date = datetime.datetime.strptime(session_date, "%Y-%m-%d").date()

        # Cálculo do valor inteira
        preco_base = 20
        if is_3d:
            preco_base += 5
        if is_imax:
            preco_base += 7

        # Adiciona valor se for sábado ou domingo
        if session_date.weekday() in (5, 6):  # sábado ou domingo
            preco_base += 8

        preco_inteira = Decimal(preco_base).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        preco_meia = (preco_inteira / 2).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        ingressos = [
            {
            "tipo": 1,
            "nome": "inteira",
            "valor": float(preco_inteira),
            "tipo_pago": "monetario"
            },
            {
            "tipo": 2,
            "nome": "meia",
            "valor": float(preco_meia),
            "tipo_pago": "monetario"
            }
        ]

        pontos_cliente = 0
        if cpf:
            pontos_query = """
                SELECT quantidade_pontos AS total_pontos
                FROM cliente
                WHERE cpf = %s
            """
            pontos_result = RawSQLHelper.execute_query(pontos_query, [cpf])
            if pontos_result and pontos_result[0]["total_pontos"] is not None:
                pontos_cliente = pontos_result[0]["total_pontos"]

            preco_pontos = int((preco_inteira * 10).to_integral_value(rounding=ROUND_HALF_UP))
            ingressos.append({
                "tipo": 3,
                "nome": "club",
                "valor": preco_pontos,
                "tipo_pago": "pontos"
            })

        return Response({
            "pontos": pontos_cliente,
            "ingressos": ingressos,
            "atributos": session_data
        })
