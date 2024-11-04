from rest_framework import serializers
from .models import UserProfile, UserAllergy

class UserAllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAllergy
        fields = ['allergy_name']

class UserProfileSerializer(serializers.ModelSerializer):
    allergies = UserAllergySerializer(many=True, read_only=True)
    selected_allergies = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = UserProfile
        fields = ['has_allergies', 'is_vegan', 'gender', 
                 'random_name_enabled', 'nickname', 'allergies', 
                 'selected_allergies']

    def create(self, validated_data):
        allergies_data = validated_data.pop('selected_allergies', [])
        user_profile = UserProfile.objects.create(**validated_data)
        
        for allergy_name in allergies_data:
            UserAllergy.objects.create(
                user_profile=user_profile,
                allergy_name=allergy_name
            )
        return user_profile