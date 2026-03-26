from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.serializers import OfficerTokenObtainPairSerializer
from accounts.views import MeView

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(serializer_class=OfficerTokenObtainPairSerializer)),
    path("refresh/", TokenRefreshView.as_view()),
    path("me/", MeView.as_view()),
]
