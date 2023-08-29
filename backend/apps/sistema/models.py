from django.db import models

class Redes(models.Model):
    nombre = models.CharField(max_length=50) #red100
    monto = models.DecimalField(max_digits=10, decimal_places=2) #$100

    class Meta:
        verbose_name = 'Red'
        verbose_name_plural = 'Redes'
        ordering = ['id']

    def __str__(self):
        return self.nombre

class Donaciones(models.Model):
    red = models.ForeignKey(Redes, on_delete=models.CASCADE)
    donador = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='donador')
    beneficiario = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='beneficiario')
    fecha = models.DateTimeField(auto_now_add=True)
    evidencia = models.ImageField(upload_to='evidencias', blank=True, null=True)

    class Meta:
        verbose_name = 'Donacion'
        verbose_name_plural = 'Donaciones'
        ordering = ['id']

    def __str__(self):
        return f'{self.red} - {self.donador} - {self.beneficiario}'
    
class DonacionRevision(models.Model):
    donacion = models.ForeignKey(Donaciones, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    comentarios = models.TextField(blank=True, null=True)
    aprobado = models.BooleanField(default=False)
    revisor = models.ForeignKey('users.User', on_delete=models.CASCADE)
    resolucion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'DonacionRevision'
        verbose_name_plural = 'DonacionRevisiones'
        ordering = ['id']

    def __str__(self):
        return self.id

