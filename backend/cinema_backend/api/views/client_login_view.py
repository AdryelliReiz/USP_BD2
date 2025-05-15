from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from api.utils import RawSQLHelper
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

class ClientLoginView(ViewSet):
    """
    View to login as site user."
    """
    permission_classes = [AllowAny]
    def create(self, request):
        email = request.data.get("email")
        password = request.data.get("senha")

        if not email or not password:
            return Response({"error": "Emal and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        query = """
            SELECT email, senha, cpf, nome, sobrenome
            FROM cliente
            WHERE email = %s
        """

        user_data = RawSQLHelper.execute_query(query, [email])

        if not user_data:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        user_data = user_data[0]
        print(user_data)

        if not check_password(password, user_data["senha"]):
            return Response({"error": "Invalid email or passwordd"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken()
        refresh["user_id"] = user_data["cpf"]
        refresh["nome"] = user_data["nome"]
        refresh["sobrenome"] = user_data["sobrenome"]


        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
