from django.urls import path

from .views import *

urlpatterns = [
    path('donaciones-enviadas/<int:id>/', DonacionesEnviadas.as_view()),
]