import os
from django.db import migrations, connection

def load_sql_file(apps, schema_editor):
    sql_file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'schemas', 'cinema-DML.sql')
    sql_file_path = os.path.abspath(sql_file_path)

    with open(sql_file_path, 'r') as f:
        lines = f.readlines()

    statements = []
    current_stmt = []
    inside_do_block = False

    for line in lines:
        stripped = line.strip()

        if stripped.upper().startswith("DO $$"):
            inside_do_block = True

        current_stmt.append(line)

        # Verifica fim de bloco DO
        if inside_do_block and stripped.endswith("$$;"):
            inside_do_block = False
            statements.append(''.join(current_stmt).strip())
            current_stmt = []
        elif not inside_do_block and stripped.endswith(";"):
            statements.append(''.join(current_stmt).strip())
            current_stmt = []

    # Executa as instruções
    with connection.cursor() as cursor:
        for stmt in statements:
            if stmt:
                cursor.execute(stmt)



class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_DDL'),
    ]

    operations = [
        migrations.RunPython(load_sql_file),
    ]
