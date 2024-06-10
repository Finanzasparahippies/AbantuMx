from django.contrib import admin
from .models import *

class DonacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'red', 'donador', 'beneficiario', 'fecha']
    list_filter = ['red']
    search_fields = ['donador__email', 'beneficiario__email']
    class Meta:
        model = Donaciones
        fields = 'red', 'donador', 'beneficiario', 'fecha', 'evidencia'

class DonacionRevisionAdmin(admin.ModelAdmin):
    list_display = ['id', 'donacion', 'fecha', 'aprobado', 'revisor', 'resolucion', 'donacion__fecha', 'donacion__donador', 'donacion__beneficiario']
    
    list_filter = ['aprobado']
    
    search_fields = ['donacion__donador__email', 'donacion__beneficiario__email']

    class Meta:
        model = DonacionRevision
        fields = 'donacion', 'fecha', 'comentarios', 'aprobado', 'revisor', 'resolucion',

admin.site.register(Redes)
admin.site.register(Donaciones, DonacionAdmin)
admin.site.register(DonacionRevision, DonacionRevisionAdmin)
admin.site.register(Suscripcion)

