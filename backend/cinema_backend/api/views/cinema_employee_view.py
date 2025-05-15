from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.permissions import IsAdmin
from api.utils import RawSQLHelper
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

class CinemaEmployeeView(ViewSet):
    """
    Busca o CPF e o nome dos funcionarios que nao sao admins e nem gerentes desse cinema.
    """
    permission_classes = [IsAdmin]

    def retrieve(self, request, pk):
        query = """
            SELECT F.nome, C.cpf
            FROM funcionario AS F
            INNER JOIN fcomum AS C
            ON F.cpf = C.cpf
            WHERE F.trabalha_em = %s
        """

        cinemaEmployeeData = RawSQLHelper.execute_query(query, [pk])

        if not cinemaEmployeeData:
            return Response({"error": "Invalid CNPJ or number of employees."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(cinemaEmployeeData)
