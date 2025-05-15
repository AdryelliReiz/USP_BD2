from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from rest_framework.permissions import AllowAny
from rest_framework import status

class CinemaView(ViewSet):
    permission_classes = [AllowAny]
    def retrieve(self, request, pk):

        query = """
        SELECT
        C.nome AS cinema_nome,
        C.cnpj,
        F.nome,
        F.sobrenome,
        C.rua,
        C.n_end,
        C.complemento,
        C.telefone
        FROM
        cinema AS C
        INNER JOIN
        funcionario AS F ON C.cnpj = F.trabalha_em
        INNER JOIN
        gerente AS G ON F.cpf = G.cpf
        WHERE
        C.nome ILIKE %s
        """

        client_data = RawSQLHelper.execute_query(query, [f"%{pk}%"])
        return Response(client_data)

    def create(self, request):
        name = request.data.get("nome")
        cnpj = request.data.get("cnpj")
        phoneNumber = request.data.get("telefone")
        street = request.data.get("rua")
        streetNumber = request.data.get("n_end")
        complement = request.data.get("complemento")
        cep = request.data.get("cep")

        if not cnpj or not name:
            return Response({"error": "CNPJ and name are required"}, status=status.HTTP_400_BAD_REQUEST)

        if not street or not streetNumber or not cep:
            return Response({"error": "Addres is required. Please fill Street, Number and CEP correctly"}, status=status.HTTP_400_BAD_REQUEST)

        if not phoneNumber:
            return Response({"error": "Phone Number is required"}, status=status.HTTP_400_BAD_REQUEST)


        if complement:
            insertQuery = """
                INSERT INTO cinema
                ("nome", "cnpj", "telefone", "rua", "n_end", "complemento", "cep")
                VALUES
                (%s, %s, %s, %s, %s, %s, %s)
            """
            registrationResult = RawSQLHelper.execute_query_execute(insertQuery, [name, cnpj, phoneNumber, street, streetNumber, complement, cep])

        if not complement:
            insertQuery = """
                INSERT INTO cinema
                ("nome", "cnpj", "telefone", "rua", "n_end", "cep")
                VALUES
                (%s, %s, %s, %s, %s, %s)
            """
            registrationResult = RawSQLHelper.execute_query_execute(insertQuery, [name, cnpj, phoneNumber, street, streetNumber, cep])

        return Response(status=status.HTTP_200_OK)
