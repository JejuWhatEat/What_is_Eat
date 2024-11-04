from django.contrib import admin
from django.urls import path
from accounts import views  # accounts 앱의 views를 직접 import

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/signup/', views.signup, name='signup'),
]