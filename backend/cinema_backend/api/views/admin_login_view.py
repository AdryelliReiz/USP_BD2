from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from api.utils import RawSQLHelper
from rest_framework import status

from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

class AdminLoginView(ViewSet):
    """
    View to login as an admin or staff member.
    """
    permission_classes = [AllowAny]  # Allow access to unauthenticated users
    def create(self, request):
        email = request.data.get("email")
        password = request.data.get("senha")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        query = """
            SELECT f.*, email, senha, trabalha_em, c.nome AS cinema_nome, role
            FROM funcionario f
            JOIN (
                SELECT *, 'admin' AS role FROM administrador
                UNION
                SELECT *, 'staff' AS role FROM gerente
            ) AS super_roles ON f.cpf = super_roles.cpf
            INNER JOIN cinema AS c ON f.trabalha_em = c.cnpj
            WHERE super_roles.email = %s
        """
        user_data = RawSQLHelper.execute_query(query, [email])

        if not user_data:
            print("No user found with the provided email.")
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        user_data = user_data[0]
        print(user_data)
        print(password)
        print(user_data["senha"])

        # Verify password
        if password != user_data["senha"]:
            print("Password does not match.")
            return Response({"error": "Invalid email or passwordd"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT tokens
        refresh = RefreshToken()
        refresh["user_id"] = user_data["cpf"]
        refresh["nome"] = user_data["nome"]
        refresh["sobrenome"] = user_data["sobrenome"]
        refresh["cinema_id"] = user_data["trabalha_em"]
        refresh["cinema_nome"] = user_data["cinema_nome"]
        refresh["role"] = user_data["role"]
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
