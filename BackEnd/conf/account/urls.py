# urls.py
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
   SignUpView, LoginView, save_allergies, save_profile,
   save_preferred_foods, save_unpreferred_foods, get_food_images
)

urlpatterns = [
   path('signup/', SignUpView.as_view(), name='signup'),
   path('login/', LoginView.as_view(), name='login'),
   path('save-allergies/', save_allergies, name='save_allergies'),
   path('save-profile/', save_profile, name='save_profile'),
   path('save-preferred-foods/', save_preferred_foods, name='save_preferred_foods'),
   path('save-unpreferred-foods/', save_unpreferred_foods, name='save_unpreferred_foods'),
   path('food-images/', get_food_images, name='food_images'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)