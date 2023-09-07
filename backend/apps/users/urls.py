from django.urls import path
from .views import *

app_name = 'apps.users'

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('check-token/', checkToken.as_view(), name='checkToken'),
    path('create-suscripcion/', CreateSuscripcion.as_view(), name='createSuscripcion'),
]