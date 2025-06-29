from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from api.utils import RawSQLHelper
from api.permissions import IsAdmin

class CinemaEmployeeView(ViewSet):
    """
    Admin interface for managing employees across the network.
    """
    permission_classes = [IsAdmin]

    def list(self, request):
        nome = request.query_params.get("nome")
        cpf = request.query_params.get("cpf")
        tipo = request.query_params.get("tipo")
        cnpj = request.query_params.get("cinema_cnpj")

        query = """
        SELECT f.nome,
               CASE
                   WHEN g.cpf IS NOT NULL THEN 'Gerente'
                   WHEN a.cpf IS NOT NULL THEN 'Administrador'
                   ELSE 'Funcionário'
               END AS tipo_funcionario,
               f.cpf,
               c.nome AS trabalha_em,
               f.data_contratado,
               COALESCE(g.email, a.email) AS email_corporativo
        FROM funcionario f
        LEFT JOIN gerente g ON f.cpf = g.cpf
        LEFT JOIN administrador a ON f.cpf = a.cpf
        LEFT JOIN cinema c ON f.trabalha_em = c.cnpj
        WHERE 1=1
        """
        params = []
        if cnpj:
            query += " AND f.trabalha_em = %s"
            params.append(cnpj)
        if nome:
            query += " AND f.nome ILIKE %s"
            params.append(f"%{nome}%")
        if cpf:
            query += " AND f.cpf = %s"
            params.append(cpf)
        if tipo:
            tipo_map = {"gerente": "Gerente", "admin": "Administrador", "comum": "Funcionário"}
            query += """
            AND CASE
                WHEN g.cpf IS NOT NULL THEN 'Gerente'
                WHEN a.cpf IS NOT NULL THEN 'Administrador'
                ELSE 'Funcionário'
            END = %s
            """
            params.append(tipo_map.get(tipo.lower()))

        employees = RawSQLHelper.execute_query(query, params)
        return Response(employees, status=status.HTTP_200_OK)

    def list_cinemas(self, request):
        query = "SELECT nome, cnpj FROM cinema ORDER BY nome"
        cinemas = RawSQLHelper.execute_query(query)
        return Response(cinemas, status=status.HTTP_200_OK)

    def create(self, request):
        nome = request.data.get("nome")
        sobrenome = request.data.get("sobrenome")
        cpf = request.data.get("cpf")
        tipo = request.data.get("tipo")
        cinema_cnpj = request.data.get("cinema_cnpj")
        email = request.data.get("email")
        senha = request.data.get("senha")

        if not all([nome, sobrenome, cpf, tipo, cinema_cnpj]):
            return Response({"error": "Nome, sobrenome, CPF, tipo e CNPJ do cinema são obrigatórios."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            insert_funcionario_query = """
            INSERT INTO funcionario (cpf, nome, sobrenome, trabalha_em, data_contratado)
            VALUES (%s, %s, %s, %s, NOW())
            """
            RawSQLHelper.execute_query(insert_funcionario_query, [cpf, nome, sobrenome, cinema_cnpj])

            if tipo.lower() == "gerente":
                if not email or not senha:
                    raise ValueError("E-mail e senha são obrigatórios para Gerente.")
                insert_gerente_query = "INSERT INTO gerente (cpf, email, senha) VALUES (%s, %s, %s)"
                RawSQLHelper.execute_query(insert_gerente_query, [cpf, email, senha])
            elif tipo.lower() == "admin":
                if not email or not senha:
                    raise ValueError("E-mail e senha são obrigatórios para Administrador.")
                insert_admin_query = "INSERT INTO administrador (cpf, email, senha) VALUES (%s, %s, %s)"
                RawSQLHelper.execute_query(insert_admin_query, [cpf, email, senha])

            return Response({"message": "Funcionário criado com sucesso."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        nome = request.data.get("nome")
        cinema_cnpj = request.data.get("cinema_cnpj")
        email = request.data.get("email")
        senha = request.data.get("senha")

        try:
            if nome or cinema_cnpj:
                update_fields = []
                params = []
                if nome:
                    update_fields.append("nome = %s")
                    params.append(nome)
                if cinema_cnpj:
                    update_fields.append("trabalha_em = %s")
                    params.append(cinema_cnpj)
                if update_fields:
                    update_funcionario_query = f"UPDATE funcionario SET {', '.join(update_fields)} WHERE cpf = %s"
                    params.append(pk)
                    RawSQLHelper.execute_query(update_funcionario_query, params)

            if email or senha:
                table = None
                if RawSQLHelper.execute_query("SELECT cpf FROM gerente WHERE cpf = %s", [pk]):
                    table = "gerente"
                elif RawSQLHelper.execute_query("SELECT cpf FROM administrador WHERE cpf = %s", [pk]):
                    table = "administrador"

                if table:
                    columns = []
                    params = []
                    if email:
                        columns.append("email = %s")
                        params.append(email)
                    if senha:
                        columns.append("senha = %s")
                        params.append(senha)
                    params.append(pk)

                    update_query = f"UPDATE {table} SET {', '.join(columns)} WHERE cpf = %s"
                    RawSQLHelper.execute_query(update_query, params)

            return Response({"message": "Funcionario atualizado com sucesso."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        try:
            RawSQLHelper.execute_query("DELETE FROM gerente WHERE cpf = %s", [pk])
            RawSQLHelper.execute_query("DELETE FROM administrador WHERE cpf = %s", [pk])
            remove_funcionario_query = """
            UPDATE funcionario SET data_fim_contrato = NOW() WHERE cpf = %s
            """
            RawSQLHelper.execute_query(remove_funcionario_query, [pk])
            return Response({"message": "Funcionario excluido com sucesso."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
