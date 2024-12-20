# Generated by Django 5.1.3 on 2024-11-28 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0006_unpreferredfood_food_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='NutritionalInformation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('food_name', models.CharField(max_length=100)),
                ('calories', models.IntegerField()),
                ('carbohydrates', models.FloatField()),
                ('protein', models.FloatField()),
                ('fat', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=500)),
            ],
        ),
    ]
