# Generated by Django 4.2.4 on 2024-03-13 00:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sistema', '0003_alter_suscripcion_tipo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='donacionrevision',
            name='revisor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
