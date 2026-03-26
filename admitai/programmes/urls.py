from django.urls import include, path
from rest_framework.routers import DefaultRouter

from programmes.views import ProgrammeViewSet

router = DefaultRouter()
router.register(r"", ProgrammeViewSet, basename="programme")

urlpatterns = [
    path("", include(router.urls)),
]
