from django.contrib import admin
from .models import UserProfile, UserAllergy  # Allergy를 UserAllergy로 수정

admin.site.register(UserProfile)
admin.site.register(UserAllergy)