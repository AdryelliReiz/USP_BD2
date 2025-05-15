from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from api.utils import RawSQLHelper
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

class ClientRegisterView(ViewSet):
    """
    Register a new site user."
    """
    permission_classes = [AllowAny]
    def create(self, request):
        email = request.data.get("email")
        password = request.data.get("senha")
        cpf = request.data.get("cpf")
        phoneNumber = request.data.get("telefone")
        street = request.data.get("rua")
        streetNumber = request.data.get("n_end")
        complement = request.data.get("complemento")
        firstName = request.data.get("nome")
        lastName = request.data.get("sobrenome")
        cep = request.data.get("cep")


        if not email or not password:
            return Response({"error": "Emal and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if not firstName or not lastName:
            return Response({"error": "First and Last names are required"}, status=status.HTTP_400_BAD_REQUEST)

        if not street or not streetNumber or not cep:
            return Response({"error": "Addres is required. Please fill Street, Number and CEP correctly"}, status=status.HTTP_400_BAD_REQUEST)

        if not cpf:
            return Response({"error": "CPF is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not phoneNumber:
            return Response({"error": "Phone Number is required"}, status=status.HTTP_400_BAD_REQUEST)

        query = """
            SELECT cpf
            FROM cliente
            WHERE cpf = '%s'
            OR email = '%s'
        """

        user_data = RawSQLHelper.execute_query(query, [cpf, email])

        if user_data:
            return Response({"error": "User is already registered!"}, status=status.HTTP_401_UNAUTHORIZED)

        if complement:
            insertQuery = """
                INSERT INTO cliente
                ("cpf", "nome", "sobrenome", "telefone", "email", "rua", "n_end", "complemento", "cep", "senha")
                VALUES
                ('%s', '%s', '%s', %s, '%s', '%s', %s, '%s', '%s', '%s')
            """
            registrationResult = RawSQLHelper.execute_query(insertQuery, [cpf, firstName, lastName, phoneNumber, email, street, streetNumber, complement, cep, password])
        else:
            insertQuery = """
                INSERT INTO cliente
                ("cpf", "nome", "sobrenome", "telefone", "email", "rua", "n_end", "cep", "senha")
                VALUES
                ('%s', '%s', '%s', %s, '%s', '%s', %s, '%s', '%s')
            """
            registrationResult = RawSQLHelper.execute_query(insertQuery, [cpf, firstName, lastName, phoneNumber, email, street, streetNumber, cep, password])

        if registrationResult:
            print("Successful registration!")

        return Response(status=status.HTTP_200_OK)

