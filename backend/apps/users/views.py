from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from apps.sistema.models import *

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data["id"] = self.user.id
        data["rol"] = self.user.role
        data["name"] = self.user.first_name
        data["last_name"] = self.user.last_name

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class checkToken(APIView):

    def post(self, request, format=None):
        data = request.data
        token = data['token']
        if token:
            return Response({'message': 'Token valido'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Token invalido'}, status=status.HTTP_400_BAD_REQUEST)
        

class CreateUser(APIView):

    def post(self, request, format=None):
        data = request.data
        email = data['email']
        password = data['password']
        first_name = data['first_name']
        last_name = data['last_name']
        phone = data['phone']
        rfc = data['rfc']
        bank_card = data['bank_card']
        bank_account = data['bank_account']
        bank_clabe = data['bank_clabe']
        terms = data['terms']
        role = data['role']

        if User.objects.filter(email=email).exists():
            return Response({'message': 'El correo ya existe'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name, phone=phone, rfc=rfc, bank_card=bank_card, bank_account=bank_account, bank_clabe=bank_clabe, terms=terms, role=role)
            user.save()

            return Response({'message': 'Usuario creado correctamente'}, status=status.HTTP_201_CREATED)
        
class CreateSuscripcion(APIView):

    def post(self, request, format=None):
        data = request.data
        red = Redes.objects.get(nombre=data['red'])
        donador = User.objects.get(id=data['donador_id'])
        beneficiario = User.objects.get(codigo=data['codigo'])

        last_suscripcion = Suscripcion.objects.filter(propietario=beneficiario, red=red).last() if Suscripcion.objects.filter(propietario=beneficiario).exists() else None
        registros_count = Suscripcion.objects.filter(propietario=beneficiario, red=red).count() if last_suscripcion != None else 0
        beneficiario_padre = Suscripcion.objects.get(donador=beneficiario, red=red).beneficiario if Suscripcion.objects.filter(donador=beneficiario, red=red) else None

        if last_suscripcion != None:
            if registros_count < 4:
                if beneficiario_padre != None:
                    if last_suscripcion.tipo == 'A':
                        Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_padre, tipo='B', propietario=beneficiario)
                    else:
                        Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A', propietario=beneficiario)
                else:
                    Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A', propietario=beneficiario)
                return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'El usuario ya tiene 4 registros'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if registros_count < 4:
                Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A', propietario=beneficiario)
                return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'El usuario ya tiene 4 registros'}, status=status.HTTP_400_BAD_REQUEST)
            

        



