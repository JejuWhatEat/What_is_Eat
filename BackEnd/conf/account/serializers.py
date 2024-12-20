# serializers.py
from rest_framework import serializers
from .models import UserAccount, UserInfo, Allergy, FoodCategory, PreferredFood, UnpreferredFood, FoodImage

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

class FoodImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = FoodImage
        fields = ['id', 'food_name', 'image_url', 'food_type']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None