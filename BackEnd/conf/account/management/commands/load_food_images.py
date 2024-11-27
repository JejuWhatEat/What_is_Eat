# account/management/commands/load_food_images.py 생성
from django.core.management.base import BaseCommand
from django.core.files import File
from account.models import FoodImage, FoodCategory
import os

class Command(BaseCommand):
    help = '음식 이미지 초기 데이터 로드'

    def handle(self, *args, **options):
        # preferred foods (image1 ~ image16)
        for i in range(1, 17):
            image_path = f'media/food_images/image{i}.jpeg'
            if os.path.exists(image_path):
                with open(image_path, 'rb') as f:
                    FoodImage.objects.create(
                        food_name=f'food{i}',
                        image=File(f, name=f'image{i}.jpeg'),
                        food_type='preferred'
                    )
                    self.stdout.write(f'Created preferred food image {i}')

        # unpreferred foods (image21 ~ image28)
        for i in range(21, 29):
            image_path = f'media/food_images/image{i}.jpeg'
            if os.path.exists(image_path):
                with open(image_path, 'rb') as f:
                    FoodImage.objects.create(
                        food_name=f'food{i}',
                        image=File(f, name=f'image{i}.jpeg'),
                        food_type='unpreferred'
                    )
                    self.stdout.write(f'Created unpreferred food image {i}')