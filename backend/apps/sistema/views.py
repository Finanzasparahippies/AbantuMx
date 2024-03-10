from .models import *
from apps.users.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from django.utils import timezone


class DonacionesEnviadas(APIView):
    def get(self, request, id, format=None):
        usuario = User.objects.get(id=id)
        donaciones = Donaciones.objects.filter(donador=usuario).order_by('-fecha')[:3]
        list = []

        for donacion in donaciones:
            list.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'beneficiario': donacion.beneficiario.first_name + ' ' + donacion.beneficiario.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.beneficiario.profile_img.url) if donacion.beneficiario.profile_img else None,
            })

        return Response(list, status=status.HTTP_200_OK)
    

class DonacionesRecibidas(APIView):
    def get(self, request, id, format=None):
        usuario = User.objects.get(id=id)
        donaciones = Donaciones.objects.filter(beneficiario=usuario).order_by('-fecha')[:5]
        list = []

        for donacion in donaciones:
            list.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
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

        donaciones100ben = Donaciones.objects.filter(red__nombre='Red 100', beneficiario__id=id, fecha__gte=timezone.now() - timedelta(days=30)).order_by('-fecha')
        donaciones100don = Donaciones.objects.filter(red__nombre='Red 100', donador__id=id).order_by('-fecha')[:12]
        donaciones500ben = Donaciones.objects.filter(red__nombre='Red 500', beneficiario__id=id, fecha__gte=timezone.now() - timedelta(days=30)).order_by('-fecha')
        donaciones500don = Donaciones.objects.filter(red__nombre='Red 500', donador__id=id).order_by('-fecha')[:12]
        donaciones1000ben = Donaciones.objects.filter(red__nombre='Red 1000', beneficiario__id=id, fecha__gte=timezone.now() - timedelta(days=30)).order_by('-fecha')
        donaciones1000don = Donaciones.objects.filter(red__nombre='Red 1000', donador__id=id).order_by('-fecha')[:12]

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
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
            })

        for donacion in donaciones100don:
            list_100_don.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'beneficiario': donacion.beneficiario.first_name + ' ' + donacion.beneficiario.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.beneficiario.profile_img.url) if donacion.beneficiario.profile_img else None,
            })
        for donacion in donaciones500ben:
            list_500_ben.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
            })
        for donacion in donaciones500don:
            list_500_don.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'beneficiario': donacion.beneficiario.first_name + ' ' + donacion.beneficiario.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.beneficiario.profile_img.url) if donacion.beneficiario.profile_img else None,
            })
        for donacion in donaciones1000ben:
            list_1000_ben.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
            })
        for donacion in donaciones1000don:
            list_1000_don.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'beneficiario': donacion.beneficiario.first_name + ' ' + donacion.beneficiario.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.beneficiario.profile_img.url) if donacion.beneficiario.profile_img else None,
            })

        return Response(list, status=status.HTTP_200_OK)
    
class CreateDonacion(APIView):
    def post(self, request, format=None):
        data = request.data
        donador = User.objects.get(id=data['donador'])
        beneficiario = User.objects.get(id=data['beneficiario'])
        red = Redes.objects.get(nombre=data['red'])
        Donaciones.objects.create(red=red, donador=donador, beneficiario=beneficiario, evidencia=request.FILES['evidencia'])
        return Response({'message': 'Donacion creada correctamente'}, status=status.HTTP_201_CREATED)
    
class GetContributionInfo(APIView):
    def get(self, request, id, format=None):
        redes = Suscripcion.objects.filter(donador_id=id)
        

        list = [{
            'Red 100':{},
            'Red 500':{},
            'Red 1000':{},
        }]

        for red in redes:
            if red.red.nombre == 'Red 100':
                donacion_mes = Donaciones.objects.filter(donador_id=id, red__nombre='Red 100').order_by('-fecha')[0] if Donaciones.objects.filter(donador_id=id, red__nombre='Red 100').exists() else None
                if donacion_mes:
                    list[0]['Red 100'] = {
                        'id': red.id,
                        'beneficiario_id': red.beneficiario.id,
                        'beneficiario': red.beneficiario.first_name + ' ' + red.beneficiario.last_name,
                        'bank': red.beneficiario.bank,
                        'bank_card': red.beneficiario.bank_card,
                        'bank_account': red.beneficiario.bank_account,
                        'bank_clabe': red.beneficiario.bank_clabe,
                        'fecha': red.fecha,
                        'donacion_mes': True if donacion_mes.fecha < timezone.now() - timedelta(days=5) else False,
                    }
                else:
                    list[0]['Red 100'] = {
                        'id': red.id,
                        'beneficiario_id': red.beneficiario.id,
                        'beneficiario': red.beneficiario.first_name + ' ' + red.beneficiario.last_name,
                        'bank': red.beneficiario.bank,
                        'bank_card': red.beneficiario.bank_card,
                        'bank_account': red.beneficiario.bank_account,
                        'bank_clabe': red.beneficiario.bank_clabe,
                        'fecha': red.fecha,
                        'donacion_mes': True
                    }
            elif red.red.nombre == 'Red 500':
                donacion_mes = Donaciones.objects.filter(donador_id=id, red__nombre='Red 500').order_by('-fecha')[0] if Donaciones.objects.filter(donador_id=id, red__nombre='Red 500').exists() else None
                if donacion_mes:
                    list[0]['Red 500'] = {
                        'id': red.id,
                        'beneficiario_id': red.beneficiario.id,
                        'beneficiario': red.beneficiario.first_name + ' ' + red.beneficiario.last_name,
                        'bank': red.beneficiario.bank,
                        'bank_card': red.beneficiario.bank_card,
                        'bank_account': red.beneficiario.bank_account,
                        'bank_clabe': red.beneficiario.bank_clabe,
                        'fecha': red.fecha,
                        'donacion_mes': True if donacion_mes.fecha < timezone.now() - timedelta(days=5) else False,
                    }
                else:
                    list[0]['Red 500'] = {
                        'id': red.id,
                        'beneficiario_id': red.beneficiario.id,
                        'beneficiario': red.beneficiario.first_name + ' ' + red.beneficiario.last_name,
                        'bank': red.beneficiario.bank,
                        'bank_card': red.beneficiario.bank_card,
                        'bank_account': red.beneficiario.bank_account,
                        'bank_clabe': red.beneficiario.bank_clabe,
                        'fecha': red.fecha,
                        'donacion_mes': True
                    }
            elif red.red.nombre == 'Red 1000':
                donacion_mes = Donaciones.objects.filter(donador_id=id, red__nombre='Red 1000').order_by('-fecha')[0] if Donaciones.objects.filter(donador_id=id, red__nombre='Red 1000').exists() else None
                if donacion_mes:
                    list[0]['Red 1000'] = {
                        'id': red.id,
                        'beneficiario_id': red.beneficiario.id,
                        'beneficiario': red.beneficiario.first_name + ' ' + red.beneficiario.last_name,
                        'bank': red.beneficiario.bank,
                        'bank_card': red.beneficiario.bank_card,
                        'bank_account': red.beneficiario.bank_account,
                        'bank_clabe': red.beneficiario.bank_clabe,
                        'fecha': red.fecha,
                        'donacion_mes': True if donacion_mes.fecha < timezone.now() - timedelta(days=5) else False,
                    }
                else:
                    list[0]['Red 1000'] = {
                        'id': red.id,
                        'beneficiario_id': red.beneficiario.id,
                        'beneficiario': red.beneficiario.first_name + ' ' + red.beneficiario.last_name,
                        'bank': red.beneficiario.bank,
                        'bank_card': red.beneficiario.bank_card,
                        'bank_account': red.beneficiario.bank_account,
                        'bank_clabe': red.beneficiario.bank_clabe,
                        'fecha': red.fecha,
                        'donacion_mes': True
                    }


        return Response(list, status=status.HTTP_200_OK)
    
        
