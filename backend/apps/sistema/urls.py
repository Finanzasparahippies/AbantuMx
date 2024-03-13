from django.urls import path

from .views import *

urlpatterns = [
    path('donaciones-enviadas/<int:id>/', DonacionesEnviadas.as_view()),
    path('donaciones-recibidas/<int:id>/', DonacionesRecibidas.as_view()),
    path('redes/<int:id>/', GetRedesbyUser.as_view()),
    path('donaciones/<int:id>/', GetDonacionesbyRed.as_view()),
    path('donaciones-info/<int:id>/', GetContributionInfo.as_view()),
    path('crear-donacion/', CreateDonacion.as_view()),
    path('donadores-100/<int:id>/', GetDonadores100.as_view()),
    path('donadores-500/<int:id>/', GetDonadores500.as_view()),
    path('donadores-1000/<int:id>/', GetDonadores1000.as_view()),
    path('reportar-donacion/', ReportarDonacion.as_view()),
]