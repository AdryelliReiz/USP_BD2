from django.db import connection

class RawSQLHelper:
    @staticmethod
    def execute_query(query, params=None):
        with connection.cursor() as cursor:
            cursor.execute(query, params or [])
            columns = [col[0] for col in cursor.description]  # Get column names
            rows = cursor.fetchall()
        # Format results as list of dictionaries
        return [dict(zip(columns, row)) for row in rows]

    def execute_query_execute(query, params=None):
        with connection.cursor() as cursor:
            cursor.execute(query, params or [])
        return
