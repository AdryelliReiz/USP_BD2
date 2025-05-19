#!/bin/bash

{
    echo "DJANGO_SECRET_KEY=\"$(openssl rand -hex 32)\""
    echo "DJANGO_DEBUG=\"True\""
    echo "DATABASE_NAME=\"cineach\""
    echo "DATABASE_USER=\"adry\""
    echo "DATABASE_PASSWORD=\"password_adry_default\""
    echo "DATABASE_HOST=\"db\""
    echo "DATABASE_PORT=\"5432\""
} >> "backend/cinema_backend/.env"

{
    echo "API_URL=\"http://localhost:8000/api/\""
} >> "frontend/dashboard/.env"

{
    echo "API_URL=\"http://localhost:8000/api/\""
} >> "frontend/totem/.env"
