from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from api.utils import RawSQLHelper
from api.permissions import IsAdmin


class EmployeeView(ViewSet):
    """
    Admin interface for managing employees across the network.
    """
    permission_classes = [IsAdmin]

    def list(self, request):
        """
        GET /network-employees
        Retrieves all employees of the network.
        Filters can be applied for name, CPF, and type of employee.
        """
        nome = request.query_params.get("nome")
        cpf = request.query_params.get("cpf")
        tipo = request.query_params.get("tipo")

        # Query base
        query = """
        SELECT f.nome,
               CASE
                   WHEN g.cpf IS NOT NULL THEN 'Gerente'
                   WHEN a.cpf IS NOT NULL THEN 'Administrador'
                   ELSE 'Funcionario Comum'
               END AS tipo_funcionario,
               f.cpf,
               c.nome AS cinema_vinculado,
               f.data_contratado,
               COALESCE(g.email, a.email) AS email_corporativo
        FROM funcionario f
        LEFT JOIN gerente g ON f.cpf = g.cpf
        LEFT JOIN administrador a ON f.cpf = a.cpf
        LEFT JOIN cinema c ON f.trabalha_em = c.cnpj
        WHERE 1=1
        """

        # Adding filters
        params = []
        if nome:
            query += " AND f.nome ILIKE %s"
            params.append(f"%{nome}%")
        if cpf:
            query += " AND f.cpf = %s"
            params.append(cpf)
        if tipo:
            tipo_map = {"gerente": "Gerente", "admin": "Administrador", "comum": "Funcionario Comum"}
            query += """
            AND CASE
                WHEN g.cpf IS NOT NULL THEN 'Gerente'
                WHEN a.cpf IS NOT NULL THEN 'Administrador'
                ELSE 'Funcionario Comum'
            END = %s
            """
            params.append(tipo_map.get(tipo.lower()))

        employees = RawSQLHelper.execute_query(query, params)
        return Response(employees, status=status.HTTP_200_OK)

    def list_cinemas(self, request):
        """
        GET /network-employees/cinemas
        Retrieves all cinemas (name and CNPJ).
        """
        query = "SELECT nome, cnpj FROM cinema"
        cinemas = RawSQLHelper.execute_query(query)
        return Response(cinemas, status=status.HTTP_200_OK)

    def create(self, request):
        """
        POST /network-employees
        Creates a new employee.
        """
        nome = request.data.get("nome")
        cpf = request.data.get("cpf")
        tipo = request.data.get("tipo")
        cinema_cnpj = request.data.get("cinema_cnpj")
        email = request.data.get("email")
        senha = request.data.get("senha")

        if not nome or not cpf or not tipo or not cinema_cnpj:
            return Response({"error": "Nome, CPF, tipo e CNPJ do cinema sao obrigatorios."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Insert base employee
            insert_funcionario_query = """
            INSERT INTO funcionario (cpf, nome, trabalha_em, data_contratado)
            VALUES (%s, %s, %s, NOW())
            """
            RawSQLHelper.execute_query(insert_funcionario_query, [cpf, nome, cinema_cnpj])

            # Insert into specific tables based on type
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
        """
        PUT /network-employees/<cpf>
        Updates the data of an employee.
        """
        nome = request.data.get("nome")
        cinema_cnpj = request.data.get("cinema_cnpj")
        email = request.data.get("email")
        senha = request.data.get("senha")

        try:
            # Update base employee details
            if nome or cinema_cnpj:
                update_funcionario_query = "UPDATE funcionario SET "
                params = []
                if nome:
                    update_funcionario_query += "nome = %s, "
                    params.append(nome)
                if cinema_cnpj:
                    update_funcionario_query += "trabalha_em = %s, "
                    params.append(cinema_cnpj)
                update_funcionario_query = update_funcionario_query.rstrip(", ") + " WHERE cpf = %s"
                params.append(pk)
                RawSQLHelper.execute_query(update_funcionario_query, params)

            # Update admin/manager details
            if email or senha:
                update_query = """
                UPDATE {table} SET {columns}
                WHERE cpf = %s
                """
                if RawSQLHelper.execute_query("SELECT cpf FROM gerente WHERE cpf = %s", [pk]):
                    table = "gerente"
                elif RawSQLHelper.execute_query("SELECT cpf FROM administrador WHERE cpf = %s", [pk]):
                    table = "administrador"
                else:
                    table = None

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

                    update_query = update_query.format(
                        table=table,
                        columns=", ".join(columns)
                    )
                    RawSQLHelper.execute_query(update_query, params)

            return Response({"message": "Funcionario atualizado com sucesso."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        """
        DELETE /network-employees/<cpf>
        Deletes an employee by CPF.
        """
        try:
            # Remove from specific roles first
            RawSQLHelper.execute_query("DELETE FROM gerente WHERE cpf = %s", [pk])
            RawSQLHelper.execute_query("DELETE FROM administrador WHERE cpf = %s", [pk])
            # Remove from base table
            RawSQLHelper.execute_query("DELETE FROM funcionario WHERE cpf = %s", [pk])
            return Response({"message": "Funcionario excluido com sucesso."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
