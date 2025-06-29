from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from api.utils import RawSQLHelper
from api.permissions import IsStaffOrAdmin

class AdminClientView(ViewSet):
    permission_classes = [IsStaffOrAdmin]

    def list(self, request):
        cpf = request.query_params.get('cpf')
        nome = request.query_params.get('nome')
        telefone = request.query_params.get('telefone')

        filters = []
        params = []

        if cpf:
            filters.append("cpf = %s")
            params.append(cpf)
        if nome:
            filters.append("nome ILIKE %s")
            params.append(f"%{nome}%")
        if telefone:
            filters.append("telefone = %s")
            params.append(telefone)

        base_query = "SELECT id, nome, sobrenome, rua, n_end, complemento, cep, email, cpf, telefone FROM cliente"
        if filters:
            query = f"{base_query} WHERE " + " AND ".join(filters)
        else:
            query = base_query

        client_data = RawSQLHelper.execute_query(query, params)
        return Response(client_data)

    def update(self, request, pk=None):
        cpf = request.data.get('cpf')
        if not cpf:
            return Response({'error': 'CPF é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)
        fields = {k: v for k, v in request.data.items() if k != 'cpf'}
        if not fields:
            return Response({'error': 'Nenhum dado para atualizar.'}, status=status.HTTP_400_BAD_REQUEST)
        set_clause = ', '.join([f"{k} = %s" for k in fields.keys()])
        params = list(fields.values()) + [cpf]
        query = f"UPDATE cliente SET {set_clause} WHERE cpf = %s"
        RawSQLHelper.execute_query(query, params)
        return Response({'success': True})

    # DELETE: Deleta cliente pelo CPF (sem cascata)
    def destroy(self, request, pk=None):
        cpf = request.data.get('cpf')
        if not cpf:
            return Response({'error': 'CPF é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)
        query = "DELETE FROM cliente WHERE cpf = %s"
        RawSQLHelper.execute_query(query, [cpf])
        return Response({'success': True})
