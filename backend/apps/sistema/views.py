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
        donaciones = Donaciones.objects.filter(donador=usuario, activo=True).order_by('-fecha')[:3]
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
        donaciones = Donaciones.objects.filter(beneficiario=usuario, activo=True).order_by('-fecha')[:5]
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

        donaciones100ben = Donaciones.objects.filter(red__nombre='Red 100', beneficiario__id=id, fecha__gte=timezone.now() - timedelta(days=30), activo=True).order_by('-fecha')
        donaciones100don = Donaciones.objects.filter(red__nombre='Red 100', donador__id=id, activo=True).order_by('-fecha')[:12]
        donaciones500ben = Donaciones.objects.filter(red__nombre='Red 500', beneficiario__id=id, fecha__gte=timezone.now() - timedelta(days=30), activo=True).order_by('-fecha')
        donaciones500don = Donaciones.objects.filter(red__nombre='Red 500', donador__id=id, activo=True).order_by('-fecha')[:12]
        donaciones1000ben = Donaciones.objects.filter(red__nombre='Red 1000', beneficiario__id=id, fecha__gte=timezone.now() - timedelta(days=30), activo=True).order_by('-fecha')
        donaciones1000don = Donaciones.objects.filter(red__nombre='Red 1000', donador__id=id, activo=True).order_by('-fecha')[:12]

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
            reportes = DonacionRevision.objects.filter(donacion=donacion, aprobado=False)
            list_100_ben.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
                'reporte': False if len(reportes) > 0 else True,
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
            reportes = DonacionRevision.objects.filter(donacion=donacion, aprobado=False)
            list_500_ben.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
                'reporte': False if len(reportes) > 0 else True,
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
            reportes = DonacionRevision.objects.filter(donacion=donacion, aprobado=False)
            list_1000_ben.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'fecha': donacion.fecha,
                'evidencia': request.build_absolute_uri(donacion.evidencia.url) if donacion.evidencia else None,
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
                'reporte': False if len(reportes) > 0 else True,
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
                donacion_mes = Donaciones.objects.filter(donador_id=id, red__nombre='Red 100', activo=True).order_by('-fecha')[0] if Donaciones.objects.filter(donador_id=id, red__nombre='Red 100', activo=True).exists() else None
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
    

class GetDonadores100(APIView):
    def get(self, request, id, format=None):
        usuario = User.objects.get(id=id)
        donadores = Suscripcion.objects.filter(propietario=usuario, red__nombre='Red 100').order_by('fecha')
        count = Suscripcion.objects.filter(beneficiario=usuario, red__nombre='Red 100').count()
        list = []

        for donacion in donadores:
            listA = []
            list.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'donador_id': donacion.donador.id,
                'fecha': donacion.fecha,
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
                'tipo': donacion.tipo,
                'codigo': donacion.donador.codigo,
                'donadores': listA,
                'count': count
            })
            donadoresA = Suscripcion.objects.filter(propietario_id=donacion.donador.id, beneficiario_id=usuario.id).order_by('fecha')
            for donador in donadoresA:
                        listB = []
                        listA.append({
                            'id': donador.id,
                            'red': donador.red.nombre,
                            'donador': donador.donador.first_name + ' ' + donador.donador.last_name,
                            'donador_id': donador.donador.id,
                            'fecha': donador.fecha,
                            'profile_img': request.build_absolute_uri(donador.donador.profile_img.url) if donador.donador.profile_img else None,
                            'tipo': donador.tipo,
                            'codigo': donador.donador.codigo,
                            'donadores': listB
                        })
                        donadoresB = Suscripcion.objects.filter(propietario_id=donador.donador.id, beneficiario_id=usuario.id).order_by('fecha')
                        for donador1 in donadoresB:
                            listC = []
                            listB.append({
                                'id': donador1.id,
                                'red': donador1.red.nombre,
                                'donador': donador1.donador.first_name + ' ' + donador1.donador.last_name,
                                'donador_id': donador1.donador.id,
                                'fecha': donador1.fecha,
                                'profile_img': request.build_absolute_uri(donador1.donador.profile_img.url) if donador1.donador.profile_img else None,
                                'tipo': donador1.tipo,
                                'codigo': donador1.donador.codigo,
                                'donadores': listC
                            })
                            donadoresC = Suscripcion.objects.filter(propietario_id=donador1.donador.id, beneficiario_id=usuario.id).order_by('fecha')
                            for donador2 in donadoresC:
                                listC.append({
                                    'id': donador2.id,
                                    'red': donador2.red.nombre,
                                    'donador': donador2.donador.first_name + ' ' + donador2.donador.last_name,
                                    'donador_id': donador2.donador.id,
                                    'fecha': donador2.fecha,
                                    'profile_img': request.build_absolute_uri(donador2.donador.profile_img.url) if donador2.donador.profile_img else None,
                                    'tipo': donador2.tipo,
                                    'codigo': donador2.donador.codigo,
                                })

        return Response(list, status=status.HTTP_200_OK)
    

class GetDonadores500(APIView):
    def get(self, request, id, format=None):
        usuario = User.objects.get(id=id)
        donadores = Suscripcion.objects.filter(propietario=usuario, red__nombre='Red 500').order_by('fecha')
        count = Suscripcion.objects.filter(propietario=usuario, red__nombre='Red 500').count()
        list = []

        for donacion in donadores:
            listA = []
            list.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'donador_id': donacion.donador.id,
                'fecha': donacion.fecha,
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
                'tipo': donacion.tipo,
                'codigo': donacion.donador.codigo,
                'donadores': listA,
                'count': count
            })
            donadoresA = Suscripcion.objects.filter(propietario_id=donacion.donador.id, beneficiario_id=usuario.id).order_by('fecha')
            for donador in donadoresA:
                        listB = []
                        listA.append({
                            'id': donador.id,
                            'red': donador.red.nombre,
                            'donador': donador.donador.first_name + ' ' + donador.donador.last_name,
                            'donador_id': donador.donador.id,
                            'fecha': donador.fecha,
                            'profile_img': request.build_absolute_uri(donador.donador.profile_img.url) if donador.donador.profile_img else None,
                            'tipo': donador.tipo,
                            'codigo': donador.donador.codigo,
                            'donadores': listB
                        })
                        donadoresB = Suscripcion.objects.filter(propietario_id=donador.donador.id, beneficiario_id=usuario.id).order_by('fecha')
                        for donador1 in donadoresB:
                            listC = []
                            listB.append({
                                'id': donador1.id,
                                'red': donador1.red.nombre,
                                'donador': donador1.donador.first_name + ' ' + donador1.donador.last_name,
                                'donador_id': donador1.donador.id,
                                'fecha': donador1.fecha,
                                'profile_img': request.build_absolute_uri(donador1.donador.profile_img.url) if donador1.donador.profile_img else None,
                                'tipo': donador1.tipo,
                                'codigo': donador1.donador.codigo,
                                'donadores': listC
                            })
                            donadoresC = Suscripcion.objects.filter(propietario_id=donador1.donador.id, beneficiario_id=usuario.id).order_by('fecha')
                            for donador2 in donadoresC:
                                listC.append({
                                    'id': donador2.id,
                                    'red': donador2.red.nombre,
                                    'donador': donador2.donador.first_name + ' ' + donador2.donador.last_name,
                                    'donador_id': donador2.donador.id,
                                    'fecha': donador2.fecha,
                                    'profile_img': request.build_absolute_uri(donador2.donador.profile_img.url) if donador2.donador.profile_img else None,
                                    'tipo': donador2.tipo,
                                    'codigo': donador2.donador.codigo,
                                })

        return Response(list, status=status.HTTP_200_OK)


class GetDonadores1000(APIView):
    def get(self, request, id, format=None):
        usuario = User.objects.get(id=id)
        donadores = Suscripcion.objects.filter(beneficiario=usuario, red__nombre='Red 1000').order_by('fecha')
        count = Suscripcion.objects.filter(beneficiario=usuario, red__nombre='Red 1000').count()
        list = []

        for donacion in donadores:
            listA = []
            list.append({
                'id': donacion.id,
                'red': donacion.red.nombre,
                'donador': donacion.donador.first_name + ' ' + donacion.donador.last_name,
                'donador_id': donacion.donador.id,
                'fecha': donacion.fecha,
                'profile_img': request.build_absolute_uri(donacion.donador.profile_img.url) if donacion.donador.profile_img else None,
                'tipo': donacion.tipo,
                'codigo': donacion.donador.codigo,
                'donadores': listA,
                'count': count
            })
            donadoresA = Suscripcion.objects.filter(propietario_id=donacion.donador.id, beneficiario_id=usuario.id).order_by('fecha')
            for donador in donadoresA:
                        listB = []
                        listA.append({
                            'id': donador.id,
                            'red': donador.red.nombre,
                            'donador': donador.donador.first_name + ' ' + donador.donador.last_name,
                            'donador_id': donador.donador.id,
                            'fecha': donador.fecha,
                            'profile_img': request.build_absolute_uri(donador.donador.profile_img.url) if donador.donador.profile_img else None,
                            'tipo': donador.tipo,
                            'codigo': donador.donador.codigo,
                            'donadores': listB
                        })
                        donadoresB = Suscripcion.objects.filter(propietario_id=donador.donador.id, beneficiario_id=usuario.id).order_by('fecha')
                        for donador1 in donadoresB:
                            listC = []
                            listB.append({
                                'id': donador1.id,
                                'red': donador1.red.nombre,
                                'donador': donador1.donador.first_name + ' ' + donador1.donador.last_name,
                                'donador_id': donador1.donador.id,
                                'fecha': donador1.fecha,
                                'profile_img': request.build_absolute_uri(donador1.donador.profile_img.url) if donador1.donador.profile_img else None,
                                'tipo': donador1.tipo,
                                'codigo': donador1.donador.codigo,
                                'donadores': listC
                            })
                            donadoresC = Suscripcion.objects.filter(propietario_id=donador1.donador.id, beneficiario_id=usuario.id).order_by('fecha')
                            for donador2 in donadoresC:
                                listC.append({
                                    'id': donador2.id,
                                    'red': donador2.red.nombre,
                                    'donador': donador2.donador.first_name + ' ' + donador2.donador.last_name,
                                    'donador_id': donador2.donador.id,
                                    'fecha': donador2.fecha,
                                    'profile_img': request.build_absolute_uri(donador2.donador.profile_img.url) if donador2.donador.profile_img else None,
                                    'tipo': donador2.tipo,
                                    'codigo': donador2.donador.codigo,
                                })

        return Response(list, status=status.HTTP_200_OK)
    
class ReportarDonacion(APIView):
    def post(self, request, format=None):
        data = request.data
        donacion = Donaciones.objects.get(id=data['id'])
        comentarions = data['comments']

        DonacionRevision.objects.create(donacion=donacion, comentarios=comentarions, aprobado=False)

        return Response({'message': 'Donacion reportada correctamente'}, status=status.HTTP_201_CREATED)
    
class ActualizarReporte(APIView):
    def post(self, request, format=None):
        data = request.data
        reporte = DonacionRevision.objects.get(id=data['id'])
        reporte.aprobado = True
        reporte.resolucion = data['resolucion']
        reporte.revisor = User.objects.get(id=data['revisor'])
        reporte.save()

        donacion = Donaciones.objects.get(id=reporte.donacion.id)
        donacion.activo = False
        donacion.save()

        return Response({'message': 'Reporte actualizado correctamente'}, status=status.HTTP_200_OK)
    

class ReportesView(APIView):
    def get(self, request, id, format=None):
        reportes = DonacionRevision.objects.filter(donacion__beneficiario_id=id).order_by('-fecha')
        list = []

        for reporte in reportes:
            list.append({
                'id': reporte.id,
                'donacion': reporte.donacion.id,
                'fecha': reporte.fecha,
                'comentarios': reporte.comentarios,
                'aprobado': reporte.aprobado,
                'resolucion': reporte.resolucion,
                'donador': reporte.donacion.donador.first_name + ' ' + reporte.donacion.donador.last_name,
            })

        return Response(list, status=status.HTTP_200_OK)
    

class ReportesRecibidosView(APIView):
    def get(self, request, id, format=None):
        reportes = DonacionRevision.objects.filter(donacion__donador_id=id).order_by('-fecha')
        list = []

        for reporte in reportes:
            list.append({
                'id': reporte.id,
                'donacion': reporte.donacion.id,
                'fecha': reporte.fecha,
                'comentarios': reporte.comentarios,
                'aprobado': reporte.aprobado,
                'resolucion': reporte.resolucion,
                'beneficiario': reporte.donacion.beneficiario.first_name + ' ' + reporte.donacion.beneficiario.last_name,
            })

        return Response(list, status=status.HTTP_200_OK)
    

class ReportesPendientesView(APIView):
    def get(self, request, format=None):
        reportes = DonacionRevision.objects.filter(aprobado=False).order_by('-fecha')
        list = []

        for reporte in reportes:
            list.append({
                'id': reporte.id,
                'donacion': reporte.donacion.id,
                'fecha': reporte.fecha,
                'comentarios': reporte.comentarios,
                'aprobado': reporte.aprobado,
                'resolucion': reporte.resolucion,
                'donador': reporte.donacion.donador.first_name + ' ' + reporte.donacion.donador.last_name,
                'beneficiario': reporte.donacion.beneficiario.first_name + ' ' + reporte.donacion.beneficiario.last_name,
                'evidencia': request.build_absolute_uri(reporte.donacion.evidencia.url) if reporte.donacion.evidencia else None,
            })

        return Response(list, status=status.HTTP_200_OK)
    

class ReportesRevisadosView(APIView):
    def get(self, request, format=None):
        reportes = DonacionRevision.objects.filter(aprobado=True).order_by('-fecha')
        list = []

        for reporte in reportes:
            list.append({
                'id': reporte.id,
                'donacion': reporte.donacion.id,
                'fecha': reporte.fecha,
                'comentarios': reporte.comentarios,
                'aprobado': reporte.aprobado,
                'resolucion': reporte.resolucion,
                'donador': reporte.donacion.donador.first_name + ' ' + reporte.donacion.donador.last_name,
                'beneficiario': reporte.donacion.beneficiario.first_name + ' ' + reporte.donacion.beneficiario.last_name,
                'evidencia': request.build_absolute_uri(reporte.donacion.evidencia.url) if reporte.donacion.evidencia else None,
            })

        return Response(list, status=status.HTTP_200_OK)
        
    
        
