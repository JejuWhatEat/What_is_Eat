from django.db import models

class UserProfile(models.Model):
    has_allergies = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    gender = models.CharField(max_length=10)
    random_name_enabled = models.BooleanField(default=False)
    nickname = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nickname} 프로필"

class UserAllergy(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name='allergies', on_delete=models.CASCADE)
    allergy_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.user_profile.nickname} - {self.allergy_name}"