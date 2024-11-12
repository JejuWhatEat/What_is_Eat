# urls.py
from django.urls import path
from .views import SignUpView, LoginView, save_allergies, save_profile , save_preferred_foods, save_unpreferred_foods

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('save-allergies/', save_allergies, name='save_allergies'),
    path('save-profile/', save_profile, name='save_profile'),  # 추가
    path('save-preferred-foods/', save_preferred_foods, name='save_preferred_foods'),
    path('save-unpreferred-foods/', save_unpreferred_foods, name='save_unpreferred_foods'),
]