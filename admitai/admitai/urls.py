from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from applications.views import FinalDecisionView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/programmes/", include("programmes.urls")),
    path("api/applications/", include("applications.urls")),
    path("api/decisions/", FinalDecisionView.as_view()),
    path("api/screening/", include("screening.urls")),
    path("api/audit/", include("audit.urls")),
    path("api/dashboard/", include("dashboard.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
