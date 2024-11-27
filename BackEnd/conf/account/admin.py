from django.contrib import admin
from .models import *

admin.site.register(UserAccount)
admin.site.register(UserInfo)
admin.site.register(Allergy)
admin.site.register(FoodCategory)
admin.site.register(PreferredFood)
admin.site.register(UnpreferredFood)

@admin.register(FoodImage)
class FoodImageAdmin(admin.ModelAdmin):
    list_display = ['food_name', 'food_type', 'category']
    list_filter = ['food_type', 'category']
    search_fields = ['food_name']