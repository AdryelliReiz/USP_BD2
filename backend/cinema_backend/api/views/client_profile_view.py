from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from api.utils import RawSQLHelper
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

class ClientProfileView(ViewSet):
    """
    Retrieves and updates profile info specified user.
    """
    def retrieve(self, request, pk):
        retrieveQuery = "SELECT * FROM cliente WHERE cpf = %s"
        client_data = RawSQLHelper.execute_query(retrieveQuery, [pk])
        return Response(client_data)


    def update(self, request, pk):
        email = request.data.get("email")
        password = request.data.get("senha")
        phoneNumber = request.data.get("telefone")
        street = request.data.get("rua")
        streetNumber = request.data.get("n_end")
        complement = request.data.get("complemento")
        firstName = request.data.get("nome")
        lastName = request.data.get("sobrenome")
        cep = request.data.get("cep")

        query = "UPDATE cliente SET "
        placeholders = []
        columns = ["email", "password", "phoneNumber", "street", "streetNumber", "complement", "firstName", "lastName", "cep"]
        data = [email, password, phoneNumber, street, streetNumber, complement, firstName, lastName, cep]

        set_clauses = []
        for col, value in zip(columns, data):
            if value is not None:
                set_clauses.append(f"{col} = %s")
                placeholders.append(value)

        if not set_clauses:
            return Response({"error": "No fields to update"}, status=status.HTTP_400_BAD_REQUEST)

        query += ", ".join(set_clauses)  # Join the set clauses with commas
        query += " WHERE cpf = %s"
        placeholders.append(pk)  # Add CPF as the last parameter

        # print(query)
        # print(placeholders)
        return Response(status=status.HTTP_200_OK)
