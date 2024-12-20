# Generated by Django 5.1.3 on 2024-11-27 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_foodimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='Food',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('category', models.IntegerField(choices=[(0, '분식'), (1, '양식'), (2, '중식'), (3, '한식'), (4, '일식')])),
                ('image_number', models.IntegerField()),
            ],
        ),
    ]
