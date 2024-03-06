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
    
class GetDonacionesbyRed(APIView):
    def get(self, request, id, format=None):

        donaciones100ben = Donaciones.objects.filter(red__nombre='Red 100', beneficiario__id=id)
        donaciones100don = Donaciones.objects.filter(red__nombre='Red 100', donador__id=id)
        donaciones500ben = Donaciones.objects.filter(red__nombre='Red 500', beneficiario__id=id)
        donaciones500don = Donaciones.objects.filter(red__nombre='Red 500', donador__id=id)
        donaciones1000ben = Donaciones.objects.filter(red__nombre='Red 1000', beneficiario__id=id)
        donaciones1000don = Donaciones.objects.filter(red__nombre='Red 1000', donador__id=id)

        list = []
        list_100_ben = []
        list_100_don = []
        list_500_ben = []
        list_500_don = []
        list_1000_ben = []
        list_1000_don = []

        list.append({
            'donaciones100ben': list_100_ben,
            'donaciones100don': list_100_don,
            'donaciones500ben': list_500_ben,
            'donaciones500don': list_500_don,
            'donaciones1000ben': list_1000_ben,
            'donaciones1000don': list_1000_don,
        })

        for donacion in donaciones100ben:
            list_100_ben.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
            })

        for donacion in donaciones100don:
            list_100_don.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'beneficiario': donacion.beneficiario.first_name + ' ' + donacion.beneficiario.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
            })
        for donacion in donaciones500ben:
            list_500_ben.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
            })
        for donacion in donaciones500don:
            list_500_don.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'beneficiario': donacion.beneficiario.first_name + ' ' + donacion.beneficiario.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
            })
        for donacion in donaciones1000ben:
            list_1000_ben.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
            })
        for donacion in donaciones1000don:
            list_1000_don.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'beneficiario': donacion.beneficiario.first_name + ' ' + donacion.beneficiario.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
            })

        return Response(list, status=status.HTTP_200_OK)
