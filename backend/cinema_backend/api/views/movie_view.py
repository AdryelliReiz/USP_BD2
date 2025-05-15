from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from api.utils import RawSQLHelper
from rest_framework import viewsets
from api.permissions import IsAdmin
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import os
class MovieView(viewsets.ViewSet):

    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def list(self, request):
        """
        GET /movies
        Retrieves all movies with their details, whether active, and the poster path.
        """
        query = """
        SELECT
            id, titulo, ano, diretor, class_ind, idioma, duracao, eh_dub, fim_contrato, descricao,
            CASE
                WHEN fim_contrato IS NULL OR fim_contrato > NOW() THEN TRUE
                ELSE FALSE
            END AS ativo,
            CONCAT('/path/to/posters/', id, '.jpg') AS capa
        FROM filme
        """
        movies = RawSQLHelper.execute_query(query)
        return Response(movies, status=status.HTTP_200_OK)

    def create(self, request):
        """
        POST /movies
        Creates a new movie with poster upload.
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
        poster = request.FILES.get("poster")

        if not titulo or not poster:
            return Response({"error": "Title and poster are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Insert movie data
        insert_query = """
        INSERT INTO filme (titulo, ano, diretor, class_ind, idioma, duracao, eh_dub, fim_contrato, descricao)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
        """
        movie_id = RawSQLHelper.execute_query(insert_query, [
            titulo, ano, diretor, class_ind, idioma, duracao, eh_dub, fim_contrato, descricao
        ])[0]["id"]

        # Save poster to file system
        poster_path = f"/path/to/posters/{movie_id}.jpg"
        with open(poster_path, "wb") as f:
            for chunk in poster.chunks():
                f.write(chunk)

        return Response({"id": movie_id, "message": "Movie created successfully."}, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        """
        PUT /movies/<id>
        Updates movie data and replaces poster if provided.
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
        poster = request.FILES.get("poster")


        columns = ["titulo", "ano", "diretor", "class_ind", "idioma", "duracao", "eh_dub", "fim_contrato", "descricao"]
        data = [titulo, ano, diretor, class_ind, idioma, duracao, eh_dub, fim_contrato, descricao]
        set_clauses = []
        placeholders = []

        for col, value in zip(columns, data):
            if value is not None:
                set_clauses.append(f"{col} = %s")
                placeholders.append(value)

        if not set_clauses:
            return Response({"error": "No fields to update"}, status=status.HTTP_400_BAD_REQUEST)

        update_query = f"UPDATE filme SET {', '.join(set_clauses)} WHERE id = %s"
        placeholders.append(pk)
        RawSQLHelper.execute_query(update_query, placeholders)

        # Replace poster if provided
        if poster:
            poster_path = f"/path/to/posters/{pk}.jpg"
            with open(poster_path, "wb") as f:
                for chunk in poster.chunks():
                    f.write(chunk)

        return Response({"message": "Movie updated successfully."}, status=status.HTTP_200_OK)
