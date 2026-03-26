from django.db.models import Count, Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.models import StudentApplication
from audit.models import AuditLog
from dashboard.serializers import DashboardStatsSerializer
from programmes.models import Programme


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = StudentApplication.objects.count()
        pending_review = StudentApplication.objects.filter(
            Q(status=StudentApplication.STATUS_REVIEW) | Q(status=StudentApplication.STATUS_PENDING)
        ).count()
        admitted = StudentApplication.objects.filter(status=StudentApplication.STATUS_ADMITTED).count()
        rejected = StudentApplication.objects.filter(status=StudentApplication.STATUS_REJECTED).count()

        per_programme = []
        for p in Programme.objects.annotate(count=Count("applications")).order_by("name"):
            per_programme.append(
                {
                    "programme_id": p.id,
                    "programme_name": p.name,
                    "count": p.count,
                }
            )

        total_audit = AuditLog.objects.count()
        overrides = AuditLog.objects.filter(is_override=True).count()
        override_rate = (overrides / total_audit * 100.0) if total_audit else 0.0

        data = {
            "total_applications": total,
            "pending_review": pending_review,
            "admitted": admitted,
            "rejected": rejected,
            "applications_per_programme": per_programme,
            "override_rate": round(override_rate, 2),
        }
        ser = DashboardStatsSerializer(instance=data)
        return Response(ser.data)
