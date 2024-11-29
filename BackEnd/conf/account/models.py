# account/models.py
from django.db import models

class UserAccount(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.email

class UserInfo(models.Model):
    GENDER_CHOICES = [
        ('M', '남성'),
        ('F', '여성'),
    ]
    
    user_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='user_info')
    user_name = models.CharField(max_length=50)
    is_vegan = models.BooleanField(default=False)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    random_name = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user_name} ({self.user_account.email})"

class Allergy(models.Model):
    user_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='allergies')
    user_name = models.CharField(max_length=50)
    allergy_name = models.CharField(max_length=50)

    class Meta:
        unique_together = ['user_account', 'allergy_name']

    def __str__(self):
        return f"{self.user_name} - {self.allergy_name}"

class FoodCategory(models.Model):
    CATEGORY_CHOICES = [
        (0, '분식'),
        (1, '양식'),
        (2, '중식'),
        (3, '한식'),
        (4, '일식'),
    ]
    
    category_id = models.IntegerField(choices=CATEGORY_CHOICES, primary_key=True)
    category_name = models.CharField(max_length=20)

    def __str__(self):
        return self.get_category_id_display()

class PreferredFood(models.Model):
    user_info = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name='preferred_foods')
    allergy = models.ForeignKey(Allergy, on_delete=models.CASCADE, null=True, blank=True)
    user_name = models.CharField(max_length=50)
    food_name = models.CharField(max_length=100)
    food_number = models.IntegerField(null=True)  # 음식 고유 번호 추가
    category = models.ForeignKey(FoodCategory, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.user_name} - {self.food_name}"

# models.py의 UnpreferredFood 모델 수정
class UnpreferredFood(models.Model):
    user_info = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name='unpreferred_foods')
    allergy = models.ForeignKey(Allergy, on_delete=models.CASCADE, null=True, blank=True)
    user_name = models.CharField(max_length=50)
    food_name = models.CharField(max_length=100)
    food_number = models.IntegerField(null=True)  # 추가
    category = models.ForeignKey(FoodCategory, on_delete=models.SET_NULL, null=True)  # 추가

    def __str__(self):
        return f"{self.user_name} - {self.food_name}"
    

class FoodImage(models.Model):
    FOOD_TYPES = [
        ('preferred', '선호 음식'),
        ('unpreferred', '비선호 음식'),
    ]
    
    food_name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='food_images/')
    food_type = models.CharField(max_length=20, choices=FOOD_TYPES)
    category = models.ForeignKey(FoodCategory, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        db_table = 'food_images'

    def __str__(self):
        return f"{self.food_name} ({self.get_food_type_display()})"
    


# account/models.py에 추가
class Food(models.Model):
    CATEGORY_CHOICES = [
        (0, '분식'),
        (1, '양식'),
        (2, '중식'),
        (3, '한식'),
        (4, '일식'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.IntegerField(choices=CATEGORY_CHOICES)
    image_number = models.IntegerField()  # 1부터 161까지의 번호

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"
    
class Restaurant(models.Model):
    name = models.CharField(max_length=255)  # 음식점 이름
    address = models.CharField(max_length=500)  # 음식점 주소

    def __str__(self):
        return self.name

class NutritionalInformation(models.Model):
    food_name = models.CharField(max_length=100)
    calories = models.IntegerField()
    carbohydrates = models.FloatField()
    protein = models.FloatField()
    fat = models.FloatField()



