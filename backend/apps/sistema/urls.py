from django.urls import path

from .views import *

urlpatterns = [
    path('donaciones-enviadas/<int:id>/', DonacionesEnviadas.as_view()),
    path('donaciones-recibidas/<int:id>/', DonacionesRecibidas.as_view()),
    path('redes/<int:id>/', GetRedesbyUser.as_view()),
]