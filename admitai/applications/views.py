from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import IntegerField, OuterRef, Subquery, Value
from django.db.models.functions import Coalesce
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.filters import StudentApplicationFilter
from applications.models import StudentApplication
from applications.serializers import (
    FinalDecisionSerializer,
    PublicApplicationTrackingSerializer,
    StudentApplicationSerializer,
)
from audit.models import AuditLog
from screening.models import AdmissionsDecision


class StudentApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = StudentApplicationSerializer
    filterset_class = StudentApplicationFilter
    ordering_fields = ("submitted_at", "ai_score")
    ordering = ("-submitted_at",)

    def get_queryset(self):
        scores = AdmissionsDecision.objects.filter(application_id=OuterRef("pk")).values("ai_score")[:1]
        return (
            StudentApplication.objects.annotate(
                ai_score=Coalesce(Subquery(scores, output_field=IntegerField()), Value(0)),
            )
            .select_related("programme", "screening_decision")
            .all()
        )

    def get_permissions(self):
        if self.action in ("create", "track"):
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def track(self, request):
        ref = request.query_params.get("reference_number")

        if not ref:
            return Response(
                {"detail": "reference_number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Standard queryset logic from get_queryset
        qs = self.get_queryset().filter(reference_number__iexact=ref)
        app = qs.first()

        if not app:
            return Response(
                {"detail": "Application not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PublicApplicationTrackingSerializer(app)
        return Response(serializer.data)


def _officer_decision_to_status(d: str) -> str:
    return {
        "admitted": StudentApplication.STATUS_ADMITTED,
        "rejected": StudentApplication.STATUS_REJECTED,
        "review": StudentApplication.STATUS_REVIEW,
    }[d]


def _officer_to_ai_token(d: str) -> str:
    return {
        "admitted": AdmissionsDecision.REC_ADMIT,
        "rejected": AdmissionsDecision.REC_REJECT,
        "review": AdmissionsDecision.REC_REVIEW,
    }[d]


class FinalDecisionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ser = FinalDecisionSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        app = get_object_or_404(
            StudentApplication.objects.select_related("screening_decision"),
            pk=ser.validated_data["application_id"],
        )
        decision = ser.validated_data["decision"]
        override_reason = (ser.validated_data.get("override_reason") or "").strip()

        ai_rec = getattr(getattr(app, "screening_decision", None), "recommendation", None)
        ai_score_val = getattr(getattr(app, "screening_decision", None), "ai_score", 0) or 0

        if ai_rec and _officer_to_ai_token(decision) != ai_rec and not override_reason:
            return Response(
                {"override_reason": ["Required when overriding the AI recommendation."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_override = bool(ai_rec and _officer_to_ai_token(decision) != ai_rec)

        with transaction.atomic():
            app.status = _officer_decision_to_status(decision)
            app.save(update_fields=["status"])
            AuditLog.objects.create(
                application=app,
                decision=decision,
                ai_recommendation=ai_rec or "",
                ai_score=ai_score_val,
                decided_by=request.user,
                override_reason=override_reason or None,
                is_override=is_override,
            )

        return Response({"status": "ok", "application_id": app.id, "reference_number": app.reference_number})
