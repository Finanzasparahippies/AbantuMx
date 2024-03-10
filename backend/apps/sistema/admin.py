from django.contrib import admin
from .models import *

class DonacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'red', 'donador', 'beneficiario', 'fecha']
    list_filter = ['red']
    search_fields = ['red']

    class Meta:
        model = Donaciones
        fields = 'red', 'donador', 'beneficiario', 'fecha', 'evidencia'










admin.site.register(Redes)
admin.site.register(Donaciones, DonacionAdmin)
admin.site.register(DonacionRevision)
admin.site.register(Suscripcion)


