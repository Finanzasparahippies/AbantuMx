from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager

ROLES = [
    ('Usuario', 'Usuario'),
    ('Administrador', 'Administrador'),
]

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    profile_img = models.ImageField(upload_to="photos", null=True, blank=True)
    bank = models.CharField(max_length=100)
    bank_card = models.CharField(max_length=100)
    bank_account = models.CharField(max_length=100)
    bank_clabe = models.CharField(max_length=100)
    terms = models.BooleanField(default=False)
    email = models.EmailField(max_length=100, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=100, choices=ROLES, default='Usuario')
    codigo = models.CharField(max_length=100, unique=True)
    starter = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def _str_(self):
        return f'{self.email}'
    
    objects = UserManager()

    USERNAME_FIELD = 'email'

    def save(self, *args, **kwargs):
        self.codigo = self.last_name[0:3] + self.phone[4:7] + self.first_name[0:3]
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-id']
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

