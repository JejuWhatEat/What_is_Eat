from django.contrib import admin
from .models import *

admin.site.register(UserAccount)
admin.site.register(UserInfo)
admin.site.register(Allergy)
admin.site.register(FoodCategory)
admin.site.register(PreferredFood)
admin.site.register(UnpreferredFood)