import csv
import io
from datetime import datetime

import django_filters as filters
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from audit.models import AuditLog
from audit.serializers import AuditLogSerializer


class AuditLogFilter(filters.FilterSet):
    programme = filters.NumberFilter(field_name="application__programme_id")
    decision = filters.CharFilter()
    is_override = filters.BooleanFilter()
    from_date = filters.IsoDateTimeFilter(field_name="decided_at", lookup_expr="gte")
    to_date = filters.IsoDateTimeFilter(field_name="decided_at", lookup_expr="lte")
    search = filters.CharFilter(field_name="application__student_name", lookup_expr="icontains")

    class Meta:
        model = AuditLog
        fields = ("programme", "decision", "is_override", "from_date", "to_date", "search")


class AuditLogListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AuditLogSerializer
    filterset_class = AuditLogFilter
    queryset = AuditLog.objects.select_related("application", "decided_by").all()


class AuditLogExportView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = AuditLog.objects.select_related("application", "decided_by").order_by("-decided_at")
        programme = request.query_params.get("programme")
        decision = request.query_params.get("decision")
        is_override = request.query_params.get("is_override")
        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        search = request.query_params.get("search")
        if programme:
            qs = qs.filter(application__programme_id=programme)
        if decision:
            qs = qs.filter(decision=decision)
        if is_override is not None and is_override != "":
            qs = qs.filter(is_override=is_override.lower() in ("1", "true", "yes"))
        if from_date:
            qs = qs.filter(decided_at__gte=from_date)
        if to_date:
            qs = qs.filter(decided_at__lte=to_date)
        if search:
            qs = qs.filter(application__student_name__icontains=search)

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(
            [
                "id",
                "application_ref",
                "student_name",
                "decision",
                "ai_recommendation",
                "ai_score",
                "officer_email",
                "officer_name",
                "override_reason",
                "is_override",
                "decided_at",
            ]
        )
        for row in qs.iterator():
            writer.writerow(
                [
                    row.id,
                    row.application.reference_number,
                    row.application.student_name,
                    row.decision,
                    row.ai_recommendation,
                    row.ai_score,
                    row.decided_by.email,
                    row.decided_by.full_name,
                    row.override_reason or "",
                    row.is_override,
                    row.decided_at.isoformat() if row.decided_at else "",
                ]
            )

        response = HttpResponse(output.getvalue(), content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="audit-{datetime.utcnow().isoformat()}Z.csv"'
        return response
