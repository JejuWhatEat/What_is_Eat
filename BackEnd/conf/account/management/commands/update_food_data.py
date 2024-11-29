# account/management/commands/update_food_data.py
from django.core.management.base import BaseCommand
from account.models import PreferredFood, UnpreferredFood, FoodCategory


FOOD_DATA = {
    # 일식 (category: 4)
        "가라아게동": {"number": 1, "category": 4},
    "가츠동": {"number": 2, "category": 4},
    "규동": {"number": 19, "category": 4},
    "규카츠": {"number": 20, "category": 4},
    "라멘": {"number": 46, "category": 4},
    "마제소바": {"number": 54, "category": 4},
    "우동": {"number": 114, "category": 4},
    "카츠": {"number": 140, "category": 4},

    # 중식 (category: 2)
    "깐쇼새우": {"number": 21, "category": 2},
    "깐풍기": {"number": 22, "category": 2},
    "깐풍새우": {"number": 23, "category": 2},
    "꿔바로우": {"number": 24, "category": 2},
    "나시고랭": {"number": 25, "category": 2},
    "난자완스": {"number": 27, "category": 2},
    "라조기": {"number": 48, "category": 2},
    "라조육": {"number": 49, "category": 2},
    "마라샹궈": {"number": 51, "category": 2},
    "마라탕": {"number": 52, "category": 2},
    "마파두부": {"number": 53, "category": 2},
    "볶음밥": {"number": 70, "category": 2},
    "양장피": {"number": 98, "category": 2},
    "어향가지": {"number": 101, "category": 2},
    "유산슬": {"number": 119, "category": 2},
    "짜장면": {"number": 128, "category": 2},
    "짬뽕": {"number": 129, "category": 2},
    "탕수육": {"number": 143, "category": 2},
    "팔보채": {"number": 149, "category": 2},

    # 양식 (category: 1)
    "리조또": {"number": 50, "category": 1},
    "샌드위치": {"number": 79, "category": 1},
    "샐러드": {"number": 80, "category": 1},
    "스테이크": {"number": 91, "category": 1},
    "아란치니": {"number": 96, "category": 1},
    "파스타": {"number": 147, "category": 1},
    "피자": {"number": 150, "category": 1},
    "햄버거": {"number": 157, "category": 1},

    # 분식 (category: 0)
    "떡볶이": {"number": 45, "category": 0},
    "라면": {"number": 47, "category": 0},
    "만두": {"number": 57, "category": 0},
    "모둠튀김": {"number": 61, "category": 0},
    "부추전": {"number": 72, "category": 0},
    "빈대떡": {"number": 75, "category": 0},
    "순대": {"number": 88, "category": 0},
    "어묵": {"number": 100, "category": 0},
    "치즈볼": {"number": 134, "category": 0},
    "튀김": {"number": 146, "category": 0},
    "파전": {"number": 148, "category": 0},

    # 한식 (category: 3)
    "갈비찜": {"number": 3, "category": 3},
    "갈비탕": {"number": 4, "category": 3},
    "갈치구이": {"number": 5, "category": 3},
    "갈치조림": {"number": 6, "category": 3},
    "감자전": {"number": 7, "category": 3},
    "감자탕": {"number": 8, "category": 3},
    "감자튀김": {"number": 9, "category": 3},
    "갑오대패불고기": {"number": 10, "category": 3},
    "강정": {"number": 11, "category": 3},
    "건어물": {"number": 12, "category": 3},
    "게장": {"number": 13, "category": 3},
    "고기국수": {"number": 14, "category": 3},
    "고등어구이": {"number": 15, "category": 3},
    "고등어조림": {"number": 16, "category": 3},
    "고사리육개장": {"number": 17, "category": 3},
    "골뱅이소면": {"number": 18, "category": 3},
    "낙곱새": {"number": 26, "category": 3},
    "냉면": {"number": 28, "category": 3},
    "냉우동": {"number": 29, "category": 3},
    "녹두빈대떡": {"number": 30, "category": 3},
    "닭갈비": {"number": 31, "category": 3},
    "닭개장": {"number": 32, "category": 3},
    "닭도리탕": {"number": 33, "category": 3},
    "닭볶음탕": {"number": 34, "category": 3},
    "닭발": {"number": 35, "category": 3},
    "닭칼국수": {"number": 36, "category": 3},
    "대패삼겹": {"number": 37, "category": 3},
    "덮밥": {"number": 38, "category": 3},
    "돈까스": {"number": 39, "category": 3},
    "동태지리": {"number": 40, "category": 3},
    "동태찌개": {"number": 41, "category": 3},
    "된장찌개": {"number": 42, "category": 3},
    "돌솥비빔밥": {"number": 43, "category": 3},
    "떡갈비": {"number": 44, "category": 3},
    "막국수": {"number": 55, "category": 3},
    "막창": {"number": 56, "category": 3},
    "만두전골": {"number": 58, "category": 3},
    "매운탕": {"number": 59, "category": 3},
    "멸치국수": {"number": 60, "category": 3},
    "모듬전": {"number": 62, "category": 3},
    "목살": {"number": 63, "category": 3},
    "물회": {"number": 64, "category": 3},
    "미역국": {"number": 65, "category": 3},
    "밀면": {"number": 66, "category": 3},
    "밥버거": {"number": 67, "category": 3},
    "버섯전골": {"number": 68, "category": 3},
    "보말칼국수": {"number": 69, "category": 3},
    "부대찌개": {"number": 71, "category": 3},
    "불고기": {"number": 73, "category": 3},
    "비빔밥": {"number": 74, "category": 3},
    "뽕갈찜": {"number": 76, "category": 3},
    "삼겹살": {"number": 77, "category": 3},
    "삼계탕": {"number": 78, "category": 3},
    "석쇠불고기": {"number": 81, "category": 3},
    "성게국": {"number": 82, "category": 3},
    "소갈비": {"number": 83, "category": 3},
    "소고기": {"number": 84, "category": 3},
    "소고기육전": {"number": 85, "category": 3},
    "솥밥": {"number": 86, "category": 3},
    "수육": {"number": 87, "category": 3},
    "순대국": {"number": 89, "category": 3},
    "순두부찌개": {"number": 90, "category": 3},
    "스텔라떡볶이": {"number": 92, "category": 3},
    "시래기국": {"number": 93, "category": 3},
    "쌀국수": {"number": 94, "category": 3},
    "아구찜": {"number": 95, "category": 3},
    "알탕": {"number": 97, "category": 3},
    "양념갈비": {"number": 99, "category": 3},
    "여수새꼬막비빔밥": {"number": 102, "category": 3},
    "연어덮밥": {"number": 103, "category": 3},
    "오겹살": {"number": 104, "category": 3},
    "오돌뼈": {"number": 105, "category": 3},
    "오리백숙": {"number": 106, "category": 3},
    "오리샤브": {"number": 107, "category": 3},
    "오리훈제": {"number": 108, "category": 3},
    "오므라이스": {"number": 109, "category": 3},
    "옥돌볶음": {"number": 110, "category": 3},
    "옥돌탕": {"number": 111, "category": 3},
    "옥돔구이": {"number": 112, "category": 3},
    "옥전": {"number": 113, "category": 3},
    "우럭조림": {"number": 115, "category": 3},
    "우육사시미": {"number": 116, "category": 3},
    "울면": {"number": 117, "category": 3},
    "월남쌈": {"number": 118, "category": 3},
    "육개장": {"number": 120, "category": 3},
    "육회비빔밥": {"number": 121, "category": 3},
    "자리돔구이": {"number": 122, "category": 3},
    "장칼국수": {"number": 123, "category": 3},
    "전골": {"number": 124, "category": 3},
    "제육볶음": {"number": 125, "category": 3},
    "조개칼국수": {"number": 126, "category": 3},
    "족발": {"number": 127, "category": 3},
    "쟁반국수": {"number": 130, "category": 3},
    "참문어비빔밥": {"number": 131, "category": 3},
    "참치찌개": {"number": 132, "category": 3},
    "철판볶음밥": {"number": 133, "category": 3},
    "치킨": {"number": 135, "category": 3},
    "치킨마요덮밥": {"number": 136, "category": 3},
    "칠리새우": {"number": 137, "category": 3},
    "칼국수": {"number": 138, "category": 3},
    "카레": {"number": 139, "category": 3},
    "코다리": {"number": 141, "category": 3},
    "크림새우": {"number": 142, "category": 3},
    "통문어조개전골": {"number": 144, "category": 3},
    "통영멍게비빔밥": {"number": 145, "category": 3},
    "한우": {"number": 151, "category": 3},
    "한우소머리해장국": {"number": 152, "category": 3},
    "한우탕": {"number": 153, "category": 3},
    "해삼내장비빔밥": {"number": 154, "category": 3},
    "해산물라면": {"number": 155, "category": 3},
    "해장국": {"number": 156, "category": 3},
    "회": {"number": 158, "category": 3},
    "회덮밥": {"number": 159, "category": 3},
    "후무스": {"number": 160, "category": 3},
    "흑돼지": {"number": 161, "category": 3},
}

class Command(BaseCommand):
    def handle(self, *args, **options):
        # PreferredFood 업데이트
        self.stdout.write('Updating PreferredFood...')
        for food in PreferredFood.objects.all():
            if food.food_name in FOOD_DATA:
                data = FOOD_DATA[food.food_name]
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
            if food.food_name in FOOD_DATA:
                data = FOOD_DATA[food.food_name]
                food.food_number = data["number"]
                try:
                    category = FoodCategory.objects.get(category_id=data["category"])
                    food.category = category
                    food.save()
                    self.stdout.write(f'Updated {food.food_name} - number: {data["number"]}, category: {data["category"]}')
                except FoodCategory.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'Category {data["category"]} not found for {food.food_name}'))

        self.stdout.write(self.style.SUCCESS('Successfully updated all food data'))