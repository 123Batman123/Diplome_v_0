# Generated by Django 5.0.3 on 2024-05-15 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mycloud', '0004_alter_file_creator_alter_file_data_created_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Название файла'),
        ),
    ]
