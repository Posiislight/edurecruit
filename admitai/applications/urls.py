from django.urls import include, path
from rest_framework.routers import DefaultRouter

from applications.views import StudentApplicationViewSet

router = DefaultRouter()
router.register(r"", StudentApplicationViewSet, basename="application")

urlpatterns = [
    path("", include(router.urls)),
]
