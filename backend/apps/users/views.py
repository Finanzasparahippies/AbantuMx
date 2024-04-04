from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
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
        role = 'Usuario'
        profile_img = data['profile_img'] if 'profile_img' in data else None
        date_joined = datetime.now()

        if User.objects.filter(email=email).exists():
            return Response({'message': 'El correo ya existe'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name, phone=phone, bank_card=bank_card, bank_account=bank_account, bank_clabe=bank_clabe, terms=terms, role=role, bank=bank, date_joined=date_joined, profile_img=profile_img if profile_img else None)
            user.save()

            return Response({'message': 'Usuario creado correctamente'}, status=status.HTTP_201_CREATED)
        
class CreateSuscripcion(APIView):

    def post(self, request, format=None):
        data = request.data
        red = Redes.objects.get(nombre=data['red'])
        donador = User.objects.get(id=data['donador_id'])

        if data['codigo'] != '':
            beneficiario1 = User.objects.get(codigo=data['codigo'])
            beneficiario = beneficiario1 if Suscripcion.objects.filter(donador=beneficiario1, red=red).exists() else None

            if beneficiario == None:
                return Response({'message': 'Este usuario no esta activo en esta red'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            beneficiario = None

        if beneficiario != None:
            if beneficiario.starter:
                last_suscripcion = Suscripcion.objects.filter(propietario=beneficiario, red=red).last() if Suscripcion.objects.filter(propietario=beneficiario).exists() else None
                registros_count = Suscripcion.objects.filter(propietario=beneficiario, red=red).count() if last_suscripcion != None else 0

                if last_suscripcion != None:
                    if registros_count < 2:
                        if last_suscripcion.tipo == 'A1':
                            Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A2', propietario=beneficiario)
                        else:
                            Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A1', propietario=beneficiario)
                        return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
                    else:
                        return Response({'message': 'Este codigo ya se ha usado 2 veces en esta red'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    if registros_count < 2:
                        Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A1', propietario=beneficiario)
                        return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
                    else:
                        return Response({'message': 'Este usuario ya se ha usado 2 veces en esta red'}, status=status.HTTP_400_BAD_REQUEST)
            else:

                last_suscripcion = Suscripcion.objects.filter(propietario=beneficiario, red=red).last() if Suscripcion.objects.filter(propietario=beneficiario).exists() else None
                registros_count = Suscripcion.objects.filter(propietario=beneficiario, red=red).count() if last_suscripcion != None else 0
                beneficiario_padre = Suscripcion.objects.get(donador=beneficiario, red=red).beneficiario if Suscripcion.objects.filter(donador=beneficiario, red=red) else None
                padre_count = Suscripcion.objects.filter(beneficiario=beneficiario_padre, red=red).count() if beneficiario_padre != None else 0

                if last_suscripcion != None:
                    if registros_count < 4:
                        if beneficiario_padre != None:
                            if padre_count < 30:
                                if last_suscripcion.tipo == 'A1':
                                    Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_padre, tipo='B1', propietario=beneficiario)
                                elif last_suscripcion.tipo == 'A2':
                                    Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_padre, tipo='B2', propietario=beneficiario)
                                else:
                                    Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A2', propietario=beneficiario)
                            else:
                                return Response({'message': 'Esta red llego a su limite de registros'}, status=status.HTTP_400_BAD_REQUEST)
                        else:
                            Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A1', propietario=beneficiario)
                        return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
                    else:
                        return Response({'message': 'Este codigo ya se ha usado 4 veces en esta red'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    if registros_count < 4:
                        Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario, tipo='A1', propietario=beneficiario)
                        return Response({'message': 'Suscripcion creada correctamente'}, status=status.HTTP_201_CREATED)
                    else:
                        return Response({'message': 'Este usuario ya se ha usado 4 veces en esta red'}, status=status.HTTP_400_BAD_REQUEST)
        else:

            usuarios = User.objects.exclude(id=donador.id).exclude(starter=True)

            list_usuarios = []

            for usuario in usuarios:
                if Suscripcion.objects.filter(donador_id=usuario.id, red=red):
                    if Suscripcion.objects.filter(red=red, beneficiario_id=usuario.id).count() < 4 or Suscripcion.objects.filter(red=red, donador_id=usuario.id).count() == 0:
                        list_usuarios.append({
                            'id': usuario.id,
                        })
        
            if list_usuarios == []:
                return Response({'message': 'No hay lugares disponibles en esta red'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                random_user = list_usuarios[random.randint(0, len(list_usuarios) - 1)]['id']

                beneficiario_random = User.objects.get(id=random_user)


                last_suscripcion = Suscripcion.objects.filter(propietario=beneficiario_random, red=red).last() if Suscripcion.objects.filter(propietario=beneficiario_random).exists() else None
                registros_count = Suscripcion.objects.filter(propietario=beneficiario_random, red=red).count() if last_suscripcion != None else 0
                beneficiario_padre = Suscripcion.objects.get(donador=beneficiario_random, red=red).beneficiario if Suscripcion.objects.filter(donador=beneficiario_random, red=red) else None
                padre_count = Suscripcion.objects.filter(beneficiario=beneficiario_padre, red=red).count() if beneficiario_padre != None else 0

                if last_suscripcion != None:
                    if registros_count < 4:
                        if beneficiario_padre != None:
                            if padre_count < 30:
                                if last_suscripcion.tipo == 'A1':
                                    Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_padre, tipo='B1', propietario=beneficiario_random)
                                elif last_suscripcion.tipo == 'A2':
                                    Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_random, tipo='B2', propietario=beneficiario_random) 
                                else:
                                    Suscripcion.objects.create(red=red, donador=donador, beneficiario=beneficiario_random, tipo='A2', propietario=beneficiario_random)
                            else:
                                return Response({'message': 'Esta red llego a su limite de registros'}, status=status.HTTP_400_BAD_REQUEST)
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
        return Response({'id': user.id, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name, 'phone': user.phone, 'bank': user.bank, 'bank_card': user.bank_card, 'bank_account': user.bank_account, 'bank_clabe': user.bank_clabe, 'codigo': user.codigo, 'role': user.role, 'date_joined': user.date_joined, 'profile_img': request.build_absolute_uri(user.profile_img.url) if user.profile_img else None}, status=status.HTTP_200_OK)

        

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

class UpdatePassword(APIView):

    def put(self, request, id, format=None):
        user = User.objects.get(id=id)
        data = request.data
        hash = make_password(data['password'])
        user.password = hash
        user.save()
        return Response({'message': 'Contraseña actualizada correctamente'}, status=status.HTTP_200_OK)
    
class UpdateProfileImg(APIView):

    def put(self, request, id, format=None):
        user = User.objects.get(id=id)
        data = request.data
        user.profile_img = data['profile_img']
        user.save()
        return Response({'message': 'Imagen de perfil actualizada correctamente'}, status=status.HTTP_200_OK)
