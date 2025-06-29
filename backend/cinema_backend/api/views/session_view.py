from rest_framework.response import Response
from rest_framework import viewsets
from datetime import datetime, timedelta
from rest_framework import status
from api.utils import RawSQLHelper

class SessionView(viewsets.ViewSet):
    def list(self, request):
        cnpj = request.query_params.get("cinema_cnpj")
        if not cnpj:
            return Response({"error": "Cinema CNPJ é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        query = """
            SELECT se.numero, se.leg_ou_dub, se.eh_3d, s.suporta_imax, se.data, se.hora, f.titulo, f.duration, se.cancelada
            FROM session se
            LEFT JOIN filme f ON se.filme_id = f.id
            LEFT JOIN sala s ON se.sala_id = s.numero
            LEFT JOIN cinema c ON s.cinema_id = c.cnpj
            WHERE c.cnpj = %s
            AND se.cancelada = false
            ORDER BY se.data, se.hora
        """
        sessions = RawSQLHelper.execute_query(query, [cnpj])

        result = []
        now = datetime.now()
        for session in sessions:
            numero = session.get("numero") if isinstance(session, dict) else session[0]
            leg_ou_dub = session.get("leg_ou_dub") if isinstance(session, dict) else session[1]
            eh_3d = session.get("eh_3d") if isinstance(session, dict) else session[2]
            suporta_imax = session.get("suporta_imax") if isinstance(session, dict) else session[3]
            data = session.get("data") if isinstance(session, dict) else session[4]
            hora = session.get("hora") if isinstance(session, dict) else session[5]
            titulo = session.get("titulo") if isinstance(session, dict) else session[6]
            duration = session.get("duration") if isinstance(session, dict) else session[7]
            cancelada = session.get("cancelada") if isinstance(session, dict) else session[8]

            start_time = datetime.combine(data, hora)
            end_time = start_time + timedelta(minutes=duration)

            if cancelada:
                status_str = "cancelada"
            elif end_time < now:
                status_str = "exibida"
            elif start_time > now:
                status_str = "a_exibir"
            else:
                status_str = "em_exibicao"

            result.append({
                "numero": numero,
                "leg_ou_dub": leg_ou_dub,
                "eh_3d": eh_3d,
                "suporta_imax": suporta_imax,
                "data": data.strftime("%Y-%m-%d") if hasattr(data, "strftime") else str(data),
                "hora": hora.strftime("%H:%M:%S") if hasattr(hora, "strftime") else str(hora),
                "titulo": titulo,
                "duration": duration,
                "status": status_str
            })
        return Response(result, status=status.HTTP_200_OK)
    
    def update(self, request, pk=None):
        cancelada = request.data.get("cancelada")
        if cancelada is None:
            return Response({"error": "O campo 'cancelada' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        existing_session = RawSQLHelper.execute_query("SELECT cancelada FROM session WHERE numero = %s", [pk])
        if not existing_session:
            return Response({"error": "Sessão não encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
        if existing_session[0]["cancelada"] == cancelada: # Supondo que o resultado é uma lista de dicionários
            return Response({"message": "Nenhuma alteração necessária."}, status=status.HTTP_200_OK)

        RawSQLHelper.execute_query("UPDATE session SET cancelada = %s WHERE numero = %s", [cancelada, pk])
        return Response({"message": "Sessão atualizada com sucesso."}, status=status.HTTP_200_OK)
    
    def create(self, request):
        required_fields = ["eh_3d", "data", "hora", "sala_id", "filme_id"]
        for field in required_fields:
            if field not in request.data:
                return Response({"error": f"O campo '{field}' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        eh_3d = request.data.get("eh_3d")
        data = request.data.get("data")
        hora = request.data.get("hora")
        sala_id = request.data.get("sala_id")
        filme_id = request.data.get("filme_id")
        leg_ou_dub = request.data.get("leg_ou_dub", None)

        try:
            data_obj = datetime.strptime(data, "%Y-%m-%d").date()
            hora_obj = datetime.strptime(hora, "%H:%M:%S").time()
        except ValueError:
            return Response({"error": "Formato de data ou hora inválido."}, status=status.HTTP_400_BAD_REQUEST)

        query = """
            INSERT INTO session (eh_3d, data, hora, sala_id, filme_id, leg_ou_dub, cancelada)
            VALUES (%s, %s, %s, %s, %s, %s, false)
            RETURNING numero
        """
        numero_result = RawSQLHelper.execute_query(query, [eh_3d, data_obj, hora_obj, sala_id, filme_id, leg_ou_dub])
        numero = numero_result[0]["numero"] if isinstance(numero_result[0], dict) else numero_result[0][0]

        return Response({"message": "Sessão criada com sucesso.", "numero": numero}, status=status.HTTP_201_CREATED)