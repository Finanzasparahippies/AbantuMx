from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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