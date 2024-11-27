# conf/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('api/', include('account.urls')),  # 기존 URL 패턴
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)