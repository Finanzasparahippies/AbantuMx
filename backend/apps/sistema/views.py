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
    

class DonacionesRecibidas(APIView):
    def get(self, request, id, format=None):
        usuario = User.objects.get(id=id)
        donaciones = Donaciones.objects.filter(beneficiario=usuario)
        list = []

        for donacion in donaciones:
            list.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
            })

        return Response(list, status=status.HTTP_200_OK)
    
class GetRedesbyUser(APIView):
    def get(self, request, id, format=None):
        usuario = User.objects.get(id=id)
        redes = Redes.objects.all()
        suscripciones = Suscripcion.objects.filter(donador=usuario)
        list = []

        for red in redes:
            if suscripciones.filter(red=red).exists():
                list.append({
                    'id': red.id,
                    'nombre': red.nombre,
                    'activa': True,
                    'descripcion': red.monto,
                })
            else:
                list.append({
                    'id': red.id,
                    'nombre': red.nombre,
                    'activa': False,
                    'descripcion': red.monto,
                })

        return Response(list, status=status.HTTP_200_OK)
