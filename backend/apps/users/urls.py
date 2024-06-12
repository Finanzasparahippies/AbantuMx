from django.urls import path
from .views import *

app_name = 'apps.users'

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('check-token/', checkToken.as_view(), name='checkToken'),
    path('create-suscripcion/', CreateSuscripcion.as_view(), name='createSuscripcion'),
    path('register/', CreateUser.as_view(), name='createUser'),
    path('get/<int:id>/', GetUser.as_view(), name='getUser'),
    path('update/<int:id>/', UpdateUser.as_view(), name='updateUser'),
    path('update-password/<int:id>/', UpdatePassword.as_view(), name='updatePassword'),
    path('change-code/', ChangeUsersCodes.as_view(), name='changeUserCode'),
    path('get/', GetUsers.as_view(), name='getUsers'),
]