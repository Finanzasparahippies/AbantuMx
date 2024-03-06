from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random
from .models import User
from apps.sistema.models import *
from datetime import datetime
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data["id"] = self.user.id
        data["rol"] = self.user.role
        data["name"] = self.user.first_name
        data["last_name"] = self.user.last_name
        data["email"] = self.user.email
        data["phone"] = self.user.phone
        data["foto"] = self.user.profile_img.url if self.user.profile_img else None

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
        bank = data['bank']
        email = data['email']
        password = data['password']
        first_name = data['first_name']
        last_name = data['last_name']
        phone = data['phone']
        bank_card = data['bank_card']
        bank_account = data['bank_account']
        bank_clabe = data['bank_clabe']
        terms = True if data['terms'] == 'true' else False
        role = 'User'
        profile_img = data['profile_img']
        date_joined = datetime.now()

        if User.objects.filter(email=email).exists():
            return Response({'message': 'El correo ya existe'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name, phone=phone, bank_card=bank_card, bank_account=bank_account, bank_clabe=bank_clabe, terms=terms, role=role, bank=bank, date_joined=date_joined, profile_img=profile_img)
            user.save()

            return Response({'message': 'Usuario creado correctamente'}, status=status.HTTP_201_CREATED)
        
class CreateSuscripcion(APIView):

    def post(self, request, format=None):
        data = request.data
        red = Redes.objects.get(nombre=data['red'])
        donador = User.objects.get(id=data['donador_id'])

        if data['codigo'] != '':
            beneficiario = User.objects.get(codigo=data['codigo'])
        else:
            beneficiario = None

        if beneficiario:

            last_suscripcion = Suscripcion.objects.filter(propietario=beneficiario, red=red).last() if Suscripcion.objects.filter(propietario=beneficiario).exists() else None
            registros_count = Suscripcion.objects.filter(propietario=beneficiario, red=red).count() if last_suscripcion != None else 0
            beneficiario_padre = Suscripcion.objects.get(donador=beneficiario, red=red).beneficiario if Suscripcion.objects.filter(donador=beneficiario, red=red) else None

            if last_suscripcion != None:
                if registros_count < 4:
                    if beneficiario_padre != None:
                        if last_suscripcion.tipo == 'A1':
                            Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_padre, tipo='B1', propietario=beneficiario)
                        elif last_suscripcion.tipo == 'A2':
                            Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='B2', propietario=beneficiario)
                        else:
                            Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A2', propietario=beneficiario)
                    else:
                        Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A1', propietario=beneficiario)
                    return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'message': 'El usuario ya tiene 4 registros'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if registros_count < 4:
                    Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A1', propietario=beneficiario)
                    return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'message': 'El usuario ya tiene 4 registros'}, status=status.HTTP_400_BAD_REQUEST)
        else:

            usuarios = User.objects.exclude(id=donador.id)

            list_usuarios = []

            for usuario in usuarios:
                if Suscripcion.objects.filter(red=red, beneficiario_id=usuario.id):
                    if Suscripcion.objects.filter(red=red, beneficiario=usuario).count() > 0 and Suscripcion.objects.filter(red=red, beneficiario=usuario).count() < 4:
                        list_usuarios.append({
                            'id': usuario.id,
                        })
                else:
                    list_usuarios.append({
                        'id': usuario.id,
                    })

            random_user = list_usuarios[random.randint(0, len(list_usuarios) - 1)]['id']

            beneficiario_random = User.objects.get(id=random_user)

            print(beneficiario_random)

            last_suscripcion = Suscripcion.objects.filter(propietario=beneficiario_random, red=red).last() if Suscripcion.objects.filter(propietario=beneficiario_random).exists() else None
            registros_count = Suscripcion.objects.filter(propietario=beneficiario_random, red=red).count() if last_suscripcion != None else 0
            beneficiario_padre = Suscripcion.objects.get(donador=beneficiario_random, red=red).beneficiario if Suscripcion.objects.filter(donador=beneficiario_random, red=red) else None

            if last_suscripcion != None:
                if registros_count < 4:
                    if beneficiario_padre != None:
                        if last_suscripcion.tipo == 'A1':
                            Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_padre, tipo='B1', propietario=beneficiario_random)
                        elif last_suscripcion.tipo == 'A2':
                            Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_random, tipo='B2', propietario=beneficiario_random) 
                        else:
                            Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_random, tipo='A2', propietario=beneficiario_random)
                    else:
                        Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_random, tipo='A1', propietario=beneficiario_random)
                    return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'message': 'El usuario ya tiene 4 registros'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if registros_count < 4:
                    Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_random, tipo='A1', propietario=beneficiario_random)
                    return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'message': 'El usuario ya tiene 4 registros'}, status=status.HTTP_400_BAD_REQUEST)
                
class GetUser(APIView):

    def get(self, request, id, format=None):
        user = User.objects.get(id=id)
        return Response({'id': user.id, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name, 'phone': user.phone, 'bank': user.bank, 'bank_card': user.bank_card, 'bank_account': user.bank_account, 'bank_clabe': user.bank_clabe, 'codigo': user.codigo, 'role': user.role, 'date_joined': user.date_joined, 'profile_img': request.build_absolute_uri(user.profile_img.url)}, status=status.HTTP_200_OK)

        

class UpdateUser(APIView):

    def put(self, request, id, format=None):
        user = User.objects.get(id=id)
        data = request.data
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.phone = data['phone']
        user.email = data['email']
        user.bank = data['bank']
        user.bank_card = data['bank_card']
        user.bank_account = data['bank_account']
        user.bank_clabe = data['bank_clabe']
        user.save()
        return Response({'message': 'Usuario actualizado correctamente'}, status=status.HTTP_200_OK)

