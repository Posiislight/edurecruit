from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from accounts.permissions import IsAdminRole
from programmes.models import Programme
from programmes.serializers import ProgrammeSerializer


class ProgrammeViewSet(viewsets.ModelViewSet):
    serializer_class = ProgrammeSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, "role", None) == "admin":
            return Programme.objects.all().order_by("name")
        return Programme.objects.filter(is_active=True).order_by("name")

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminRole()]
