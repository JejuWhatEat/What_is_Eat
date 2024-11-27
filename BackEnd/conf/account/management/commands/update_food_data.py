# account/management/commands/update_food_data.py
from django.core.management.base import BaseCommand
from account.models import PreferredFood, UnpreferredFood, FoodCategory

class Command(BaseCommand):
    def handle(self, *args, **options):
        food_data = {
            # 일식 (category: 4)
            "가라아게동": {"number": 1, "category": 4},
            "가츠동": {"number": 2, "category": 4},
            "규동": {"number": 3, "category": 4},
            "규카츠": {"number": 4, "category": 4},
            "라멘": {"number": 5, "category": 4},
            "마제소바": {"number": 6, "category": 4},
            "오니기리": {"number": 7, "category": 4},
            "우동": {"number": 8, "category": 4},
            "일식덮밥": {"number": 9, "category": 4},
            "일식카레": {"number": 10, "category": 4},
            "돈카츠": {"number": 11, "category": 4},

            # 중식 (category: 2)
            "깐쇼새우": {"number": 12, "category": 2},
            "깐풍기": {"number": 13, "category": 2},
            "깐풍새우": {"number": 14, "category": 2},
            "꿔바로우": {"number": 15, "category": 2},
            "난자완스": {"number": 16, "category": 2},
            "마라샹궈": {"number": 17, "category": 2},
            "마라탕": {"number": 18, "category": 2},
            "마파두부": {"number": 19, "category": 2},
            "양장피": {"number": 20, "category": 2},
            "유산슬": {"number": 21, "category": 2},
            "짜장면": {"number": 22, "category": 2},
            "짬뽕": {"number": 23, "category": 2},
            "탕수육": {"number": 24, "category": 2},
            "팔보채": {"number": 25, "category": 2},

            # 양식 (category: 1)
            "리조또": {"number": 26, "category": 1},
            "샌드위치": {"number": 27, "category": 1},
            "샐러드": {"number": 28, "category": 1},
            "스테이크": {"number": 29, "category": 1},
            "스파게티": {"number": 30, "category": 1},
            "알리오올리오": {"number": 31, "category": 1},
            "크림파스타": {"number": 32, "category": 1},
            "피자": {"number": 33, "category": 1},
            "함박스테이크": {"number": 34, "category": 1},
            "햄버거": {"number": 35, "category": 1},

            # 분식 (category: 0)
            "떡볶이": {"number": 36, "category": 0},
            "라면": {"number": 37, "category": 0},
            "김밥": {"number": 38, "category": 0},
            "순대": {"number": 39, "category": 0},
            "어묵": {"number": 40, "category": 0},
            "튀김": {"number": 41, "category": 0},
            "핫도그": {"number": 42, "category": 0},

            # 한식 (category: 3)
            "갈비찜": {"number": 43, "category": 3},
            "갈비탕": {"number": 44, "category": 3},
            "갈치구이": {"number": 45, "category": 3},
            "갈치조림": {"number": 46, "category": 3},
            "감자전": {"number": 47, "category": 3},
            "감자탕": {"number": 48, "category": 3},
            # 한식 (category: 3) 부분만 추가
           "갈비찜": {"number": 43, "category": 3},
           "갈비탕": {"number": 44, "category": 3},
           "갈치구이": {"number": 45, "category": 3},
           "갈치조림": {"number": 46, "category": 3},
           "감자전": {"number": 47, "category": 3},
           "감자탕": {"number": 48, "category": 3},
           "고사리육개장": {"number": 49, "category": 3},
           "곱창전골": {"number": 50, "category": 3},
           "김치찌개": {"number": 51, "category": 3},
           "김치찜": {"number": 52, "category": 3},
           "낙지비빔밥": {"number": 53, "category": 3},
           "냉면": {"number": 54, "category": 3},
           "된장찌개": {"number": 55, "category": 3},
           "돌솥비빔밥": {"number": 56, "category": 3},
           "동태찌개": {"number": 57, "category": 3},
           "두부김치": {"number": 58, "category": 3},
           "떡갈비": {"number": 59, "category": 3},
           "매운갈비찜": {"number": 60, "category": 3},
           "미역국": {"number": 61, "category": 3},
           "밀면": {"number": 62, "category": 3},
           "배추전": {"number": 63, "category": 3},
           "백숙": {"number": 64, "category": 3},
           "부대찌개": {"number": 65, "category": 3},
           "비빔밥": {"number": 66, "category": 3},
           "삼겹살": {"number": 67, "category": 3},
           "삼계탕": {"number": 68, "category": 3},
           "새우젓파전": {"number": 69, "category": 3},
           "설렁탕": {"number": 70, "category": 3},
           "소갈비": {"number": 71, "category": 3},
           "순두부찌개": {"number": 72, "category": 3},
           "순대국": {"number": 73, "category": 3},
           "시골밥상": {"number": 74, "category": 3},
           "쌈밥": {"number": 75, "category": 3},
           "아구찜": {"number": 76, "category": 3},
           "알탕": {"number": 77, "category": 3},
           "양념갈비": {"number": 78, "category": 3},
           "연잎밥": {"number": 79, "category": 3},
           "오삼불고기": {"number": 80, "category": 3},
           "오징어볶음": {"number": 81, "category": 3},
           "육개장": {"number": 82, "category": 3},
           "육회": {"number": 83, "category": 3},
           "장어구이": {"number": 84, "category": 3},
           "제육볶음": {"number": 85, "category": 3},
           "족발": {"number": 86, "category": 3},
           "주꾸미볶음": {"number": 87, "category": 3},
           "찜닭": {"number": 88, "category": 3},
           "청국장": {"number": 89, "category": 3},
           "추어탕": {"number": 90, "category": 3},
           "콩나물국밥": {"number": 91, "category": 3},
           "해물파전": {"number": 92, "category": 3},
           "황태구이": {"number": 93, "category": 3},
        }

        # PreferredFood 업데이트
        self.stdout.write('Updating PreferredFood...')
        for food in PreferredFood.objects.all():
            if food.food_name in food_data:
                data = food_data[food.food_name]
                food.food_number = data["number"]
                try:
                    category = FoodCategory.objects.get(category_id=data["category"])
                    food.category = category
                    food.save()
                    self.stdout.write(f'Updated {food.food_name} - number: {data["number"]}, category: {data["category"]}')
                except FoodCategory.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'Category {data["category"]} not found for {food.food_name}'))

        # UnpreferredFood 업데이트
        self.stdout.write('Updating UnpreferredFood...')
        for food in UnpreferredFood.objects.all():
            if food.food_name in food_data:
                data = food_data[food.food_name]
                food.food_number = data["number"]
                try:
                    category = FoodCategory.objects.get(category_id=data["category"])
                    food.category = category
                    food.save()
                    self.stdout.write(f'Updated {food.food_name} - number: {data["number"]}, category: {data["category"]}')
                except FoodCategory.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'Category {data["category"]} not found for {food.food_name}'))

        self.stdout.write(self.style.SUCCESS('Successfully updated all food data'))