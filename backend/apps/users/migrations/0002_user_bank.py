# Generated by Django 4.2.4 on 2023-10-04 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='bank',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
    ]
