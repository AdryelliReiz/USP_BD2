import base64
from datetime import date
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from api.utils import RawSQLHelper
from api.permissions import IsAdmin

class MovieView(viewsets.ViewSet):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def list(self, request):
        """
        GET /movies
        Lista apenas filmes ativos (fim_contrato nulo ou maior que hoje).
        """
        query = """
        SELECT
            id, titulo, ano, diretor, class_ind, idioma, duracao, eh_dub, fim_contrato, descricao, cartaz
        FROM filme
        WHERE fim_contrato IS NULL OR fim_contrato > CURRENT_DATE
        """
        movies = RawSQLHelper.execute_query(query)
        return Response(movies, status=status.HTTP_200_OK)

    def create(self, request):
        """
        POST /movies
        Cria novo filme e salva o cartaz em base64 no banco.
        """
        titulo = request.data.get("titulo")
        ano = request.data.get("ano")
        diretor = request.data.get("diretor")
        class_ind = request.data.get("class_ind")
        idioma = request.data.get("idioma")
        duracao = request.data.get("duracao")
        eh_dub = request.data.get("eh_dub")
        fim_contrato = request.data.get("fim_contrato")
        descricao = request.data.get("descricao")
        cartaz = request.FILES.get("cartaz")

        if not titulo or not cartaz:
            return Response({"error": "Title and cartaz are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Converte cartaz para base64
        cartaz = base64.b64encode(cartaz.read()).decode('utf-8')

        insert_query = """
        INSERT INTO filme (titulo, ano, diretor, class_ind, idioma, duracao, eh_dub, fim_contrato, descricao, cartaz)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
        """
        movie_id = RawSQLHelper.execute_query(insert_query, [
            titulo, ano, diretor, class_ind, idioma, duracao, eh_dub, fim_contrato, descricao, cartaz
        ])[0]["id"]

        return Response({"id": movie_id, "message": "Movie created successfully."}, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        """
        PUT /movies/<id>
        Edita filme e atualiza cartaz se enviado.
        """
        titulo = request.data.get("titulo")
        ano = request.data.get("ano")
        diretor = request.data.get("diretor")
        class_ind = request.data.get("class_ind")
        idioma = request.data.get("idioma")
        duracao = request.data.get("duracao")
        eh_dub = request.data.get("eh_dub")
        fim_contrato = request.data.get("fim_contrato")
        descricao = request.data.get("descricao")
        cartaz = request.FILES.get("cartaz")

        columns = ["titulo", "ano", "diretor", "class_ind", "idioma", "duracao", "eh_dub", "fim_contrato", "descricao"]
        data = [titulo, ano, diretor, class_ind, idioma, duracao, eh_dub, fim_contrato, descricao]
        set_clauses = []
        placeholders = []

        for col, value in zip(columns, data):
            if value is not None:
                set_clauses.append(f"{col} = %s")
                placeholders.append(value)

        if cartaz:
            cartaz = base64.b64encode(cartaz.read()).decode('utf-8')
            set_clauses.append("cartaz = %s")
            placeholders.append(cartaz)

        if not set_clauses:
            return Response({"error": "No fields to update"}, status=status.HTTP_400_BAD_REQUEST)

        update_query = f"UPDATE filme SET {', '.join(set_clauses)} WHERE id = %s"
        placeholders.append(pk)
        RawSQLHelper.execute_query(update_query, placeholders)

        return Response({"message": "Movie updated successfully."}, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        """
        DELETE /movies/<id>
        Não deleta, apenas atualiza fim_contrato para hoje.
        """
        today = date.today().isoformat()
        update_query = "UPDATE filme SET fim_contrato = %s WHERE id = %s"
        RawSQLHelper.execute_query(update_query, [today, pk])
        return Response({"message": "Movie contract ended (fim_contrato set to today)."}, status=status.HTTP_200_OK)
