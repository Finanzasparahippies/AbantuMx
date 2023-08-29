from django.urls import path

from .views import *

urlpatterns = [
    path('donaciones/', DonacionesView.as_view())
]