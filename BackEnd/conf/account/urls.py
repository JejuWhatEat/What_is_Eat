from django.urls import path
from . import views

urlpatterns = [
    path('save-profile/', views.save_profile, name='save-profile'),
    path('save-allergies/', views.save_allergies, name='save-allergies'),
]