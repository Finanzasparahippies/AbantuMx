# Generated by Django 4.2.4 on 2024-03-10 01:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_user_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='codigo',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]