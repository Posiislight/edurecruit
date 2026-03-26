from rest_framework import serializers

from audit.models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    officer_name = serializers.CharField(source="decided_by.full_name", read_only=True)
    student_name = serializers.CharField(source="application.student_name", read_only=True)
    application_reference = serializers.CharField(source="application.reference_number", read_only=True)
    programme_name = serializers.CharField(source="application.programme.name", read_only=True)

    class Meta:
        model = AuditLog
        fields = (
            "id",
            "application",
            "application_reference",
            "programme_name",
            "decision",
            "ai_recommendation",
            "ai_score",
            "decided_by",
            "officer_name",
            "student_name",
            "override_reason",
            "is_override",
            "decided_at",
        )
        read_only_fields = fields
