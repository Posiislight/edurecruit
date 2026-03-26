from rest_framework import serializers

from programmes.models import Programme


class ProgrammeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programme
        fields = (
            "id",
            "name",
            "faculty",
            "description",
            "jamb_cutoff",
            "available_slots",
            "required_subjects",
            "is_active",
            "created_at",
        )
        read_only_fields = ("id", "created_at")
