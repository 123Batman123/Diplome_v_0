# Generated by Django 5.0.3 on 2024-04-03 08:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mycloud', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='hash',
            field=models.CharField(default='HASH', max_length=255, verbose_name='Название файла в хэш виде'),
        ),
    ]
