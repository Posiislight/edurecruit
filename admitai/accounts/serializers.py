from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from accounts.models import Officer


class OfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = (
            "id",
            "email",
            "username",
            "full_name",
            "university",
            "role",
            "is_active",
        )
        read_only_fields = fields


class OfficerTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["officer"] = OfficerSerializer(self.user).data
        return data
