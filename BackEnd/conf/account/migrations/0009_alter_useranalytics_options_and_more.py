# Generated by Django 5.1.3 on 2024-11-30 06:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0008_useranalytics'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='useranalytics',
            options={},
        ),
        migrations.AlterModelTable(
            name='useranalytics',
            table='user_analytics',
        ),
    ]