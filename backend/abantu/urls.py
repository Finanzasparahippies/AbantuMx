from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path('check/', trigger_error),
    path('api/admin/', admin.site.urls),
    path('api/sistema/', include('apps.sistema.urls')),
    path('api/users/', include('apps.users.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()
