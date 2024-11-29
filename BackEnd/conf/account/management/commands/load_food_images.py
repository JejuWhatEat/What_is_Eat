from django.core.management.base import BaseCommand
from django.core.files import File
from account.models import Food
from account.management.commands.update_food_data import FOOD_DATA  # 경로 수정
import os

class Command(BaseCommand):
    help = '음식 이미지 초기 데이터 로드'

    def handle(self, *args, **options):
        try:
            for i in range(1, 162):  # 1부터 161까지
                image_path = f'media/food_images/image{i}.jpeg.jpg'
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        food_name = next(name for name, data in FOOD_DATA.items() if data["number"] == i)  # food_data를 FOOD_DATA로 변경
                        Food.objects.create(
                            name=food_name,
                            image=File(f, name=f'image{i}.jpeg.jpg'),
                            food_number=i,
                            category_id=FOOD_DATA[food_name]["category"]  # food_data를 FOOD_DATA로 변경
                        )
                        self.stdout.write(f'Created food image {i}: {food_name}')
                else:
                    self.stdout.write(f'Image {i} not found at {image_path}')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error loading images: {str(e)}'))