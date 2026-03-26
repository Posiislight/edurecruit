from rest_framework import status
from rest_framework.test import APISimpleTestCase


class ApplicationRoutesSmokeTests(APISimpleTestCase):
    def test_track_endpoint_requires_reference_number_and_email(self):
        response = self.client.get("/api/applications/track/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["detail"],
            "Both reference_number and email are required.",
        )
