from rest_framework import serializers


class ProgrammeCountSerializer(serializers.Serializer):
    programme_id = serializers.IntegerField()
    programme_name = serializers.CharField()
    count = serializers.IntegerField()


class DashboardStatsSerializer(serializers.Serializer):
    total_applications = serializers.IntegerField()
    pending_review = serializers.IntegerField()
    admitted = serializers.IntegerField()
    rejected = serializers.IntegerField()
    applications_per_programme = ProgrammeCountSerializer(many=True)
    override_rate = serializers.FloatField()
