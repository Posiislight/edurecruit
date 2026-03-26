from django.contrib import admin

from screening.models import AdmissionsDecision


@admin.register(AdmissionsDecision)
class AdmissionsDecisionAdmin(admin.ModelAdmin):
    list_display = ("application", "ai_score", "recommendation", "confidence", "screened_at")
