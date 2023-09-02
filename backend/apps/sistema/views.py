from .models import *
from apps.users.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class DonacionesEnviadas(APIView):
    def get(self, request, id, format=None):
        usuario = User.objects.get(id=id)
        donaciones = Donaciones.objects.filter(donador=usuario)
        list = []

        for donacion in donaciones:
            list.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'beneficiario': donacion.beneficiario.first_name + ' ' + donacion.beneficiario.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
            })

        return Response(list, status=status.HTTP_200_OK)
