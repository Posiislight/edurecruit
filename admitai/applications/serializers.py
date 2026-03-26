from django.db import transaction
from rest_framework import serializers

from applications.models import StudentApplication
from applications.services import submit_application_and_screen
from programmes.models import Programme
from programmes.serializers import ProgrammeSerializer
from screening.models import AdmissionsDecision


class AdmissionsDecisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionsDecision
        fields = (
            "ai_score",
            "jamb_component",
            "olevel_component",
            "sitting_component",
            "recency_component",
            "qualified",
            "confidence",
            "recommendation",
            "reasoning",
            "chain_of_thought",
            "factors_used",
            "bias_flag",
            "bias_explanation",
            "audit_passed",
            "audit_remarks",
            "identified_risks",
            "screened_at",
        )


class StudentApplicationSerializer(serializers.ModelSerializer):
    screening_decision = AdmissionsDecisionSerializer(read_only=True)
    ai_score = serializers.IntegerField(read_only=True, required=False, allow_null=True)
    programme = serializers.PrimaryKeyRelatedField(queryset=Programme.objects.all())

    class Meta:
        model = StudentApplication
        fields = (
            "id",
            "reference_number",
            "student_name",
            "email",
            "phone",
            "state_of_origin",
            "programme",
            "jamb_score",
            "olevel_results",
            "number_of_sittings",
            "result_year",
            "transcript_upload",
            "id_upload",
            "status",
            "submitted_at",
            "screening_decision",
            "ai_score",
        )
        read_only_fields = (
            "id",
            "reference_number",
            "status",
            "submitted_at",
            "screening_decision",
            "ai_score",
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Nest the programme details in the output
        if instance.programme:
            representation['programme'] = ProgrammeSerializer(instance.programme).data
        return representation

    def create(self, validated_data):
        validated_data.setdefault("status", StudentApplication.STATUS_PENDING)
        with transaction.atomic():
            instance = StudentApplication.objects.create(**validated_data)
        try:
            submit_application_and_screen(instance)
        except Exception:
            pass
        return instance


class FinalDecisionSerializer(serializers.Serializer):
    application_id = serializers.IntegerField()
    decision = serializers.ChoiceField(choices=["admitted", "rejected", "review"])
    override_reason = serializers.CharField(required=False, allow_blank=True, default="")
