# Generated by Django 5.1.3 on 2024-11-26 12:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_foodcategory_useraccount_allergy_userinfo_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FoodImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('food_name', models.CharField(max_length=100)),
                ('image', models.ImageField(upload_to='food_images/')),
                ('food_type', models.CharField(choices=[('preferred', '선호 음식'), ('unpreferred', '비선호 음식')], max_length=20)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='account.foodcategory')),
            ],
            options={
                'db_table': 'food_images',
            },
        ),
    ]