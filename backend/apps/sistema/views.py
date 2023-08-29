from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class DonacionesView(APIView):
    def get(self, request):
        donaciones = Donaciones.objects.all()
        list = []

        for donacion in donaciones:
            list.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'beneficiario': donacion.beneficiario.first_name + ' ' + donacion.beneficiario.last_name,
                'fecha': donacion.fecha,
                'evidencia': donacion.evidencia.url if donacion.evidencia else None,
            })

        return Response(list, status=status.HTTP_200_OK)
