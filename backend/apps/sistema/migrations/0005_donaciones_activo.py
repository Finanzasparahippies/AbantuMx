# Generated by Django 4.2.4 on 2024-04-04 20:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sistema', '0004_alter_donacionrevision_revisor'),
    ]

    operations = [
        migrations.AddField(
            model_name='donaciones',
            name='activo',
            field=models.BooleanField(default=True),
        ),
    ]