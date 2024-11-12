# account/serializers.py
from rest_framework import serializers
from .models import UserAccount, UserInfo, Allergy, FoodCategory, PreferredFood, UnpreferredFood

class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = '__all__'

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'

class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergy
        fields = '__all__'

class FoodCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = '__all__'

class PreferredFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreferredFood
        fields = '__all__'

class UnpreferredFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnpreferredFood
        fields = '__all__'