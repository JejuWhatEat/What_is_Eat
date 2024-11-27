# account/management/commands/init_foods.py
from django.core.management.base import BaseCommand
from account.models import Food

FOODS_DATA = [
   # 일식 (category_id: 4)
   ("가라아게동", 4),
   ("가츠동", 4),
   ("규동", 4),
   ("규카츠", 4),
   ("라멘", 4),
   ("마제소바", 4),
   ("오니기리", 4),
   ("우동", 4),
   ("일식덮밥", 4),
   ("일식카레", 4),
   ("돈카츠", 4),
   
   # 중식 (category_id: 2)
   ("깐쇼새우", 2),
   ("깐풍기", 2),
   ("깐풍새우", 2),
   ("꿔바로우", 2),
   ("난자완스", 2),
   ("마라샹궈", 2),
   ("마라탕", 2),
   ("마파두부", 2),
   ("양장피", 2),
   ("유산슬", 2),
   ("짜장면", 2),
   ("짬뽕", 2),
   ("탕수육", 2),
   ("팔보채", 2),

   # 양식 (category_id: 1)
   ("리조또", 1),
   ("샌드위치", 1),
   ("샐러드", 1),
   ("스테이크", 1),
   ("스파게티", 1),
   ("알리오올리오", 1),
   ("크림파스타", 1),
   ("피자", 1),
   ("함박스테이크", 1),
   ("햄버거", 1),

   # 한식 (category_id: 3)
   ("갈비찜", 3),
   ("갈비탕", 3),
   ("갈치구이", 3),
   ("갈치조림", 3),
   ("감자전", 3),
   ("감자탕", 3),
   ("고사리육개장", 3),
   ("곱창전골", 3),
   ("김치찌개", 3),
   ("김치찜", 3),
   ("낙지비빔밥", 3),
   ("냉면", 3),
   ("된장찌개", 3),
   ("돌솥비빔밥", 3),
   ("동태찌개", 3),
   ("두부김치", 3),
   ("떡갈비", 3),
   ("매운갈비찜", 3),
   ("미역국", 3),
   ("밀면", 3),
   ("배추전", 3),
   ("백숙", 3),
   ("부대찌개", 3),
   ("비빔밥", 3),
   ("삼겹살", 3),
   ("삼계탕", 3),
   ("새우젓파전", 3),
   ("설렁탕", 3),
   ("소갈비", 3),
   ("순두부찌개", 3),
   ("순대국", 3),
   ("시골밥상", 3),
   ("쌈밥", 3),
   ("아구찜", 3),
   ("알탕", 3),
   ("양념갈비", 3),
   ("연잎밥", 3),
   ("오삼불고기", 3),
   ("오징어볶음", 3),
   ("육개장", 3),
   ("육회", 3),
   ("장어구이", 3),
   ("제육볶음", 3),
   ("족발", 3),
   ("주꾸미볶음", 3),
   ("찜닭", 3),
   ("청국장", 3),
   ("추어탕", 3),
   ("콩나물국밥", 3),
   ("해물파전", 3),
   ("황태구이", 3),

   # 분식 (category_id: 0)
   ("떡볶이", 0),
   ("라면", 0),
   ("김밥", 0),
   ("순대", 0),
   ("어묵", 0),
   ("튀김", 0),
   ("핫도그", 0),
]

class Command(BaseCommand):
   def handle(self, *args, **options):
       # 기존 데이터 삭제
       Food.objects.all().delete()
       
       # 새로운 데이터 입력
       for index, (name, category) in enumerate(FOODS_DATA, start=1):
           food = Food.objects.create(
               name=name,
               category=category,
               image_number=index
           )
           self.stdout.write(
               self.style.SUCCESS(
                   f'Created food: {food.name} (Category: {food.get_category_display()}, Image Number: {food.image_number})'
               )
           )
       
       self.stdout.write(
           self.style.SUCCESS(
               f'Successfully created {len(FOODS_DATA)} food items'
           )
       )