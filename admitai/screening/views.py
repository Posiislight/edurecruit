from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsSeniorOfficerOrAdmin
from applications.models import StudentApplication
from applications.serializers import AdmissionsDecisionSerializer
from screening.engine import screen_application


class ScreeningResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, application_id):
        app = get_object_or_404(StudentApplication.objects.select_related("screening_decision"), pk=application_id)
        decision = getattr(app, "screening_decision", None)
        if not decision:
            return Response({"detail": "No screening result yet."}, status=status.HTTP_404_NOT_FOUND)
        return Response(AdmissionsDecisionSerializer(decision).data)


class RescreenView(APIView):
    permission_classes = [IsAuthenticated, IsSeniorOfficerOrAdmin]

    def post(self, request, application_id):
        app = get_object_or_404(StudentApplication.objects.select_related("programme"), pk=application_id)
        programme = app.programme
        screen_application(app, programme)
        app.refresh_from_db()
        decision = getattr(app, "screening_decision", None)
        if not decision:
            return Response({"detail": "Screening did not produce a decision."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(AdmissionsDecisionSerializer(decision).data)
