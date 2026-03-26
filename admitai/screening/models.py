from django.db import models

from applications.models import StudentApplication


class AdmissionsDecision(models.Model):
    CONF_HIGH = "high"
    CONF_LOW = "low"
    CONF_DISQUALIFIED = "disqualified"
    CONFIDENCE_CHOICES = [
        (CONF_HIGH, "High"),
        (CONF_LOW, "Low"),
        (CONF_DISQUALIFIED, "Disqualified"),
    ]

    REC_ADMIT = "admit"
    REC_REVIEW = "review"
    REC_REJECT = "reject"
    RECOMMENDATION_CHOICES = [
        (REC_ADMIT, "Admit"),
        (REC_REVIEW, "Review"),
        (REC_REJECT, "Reject"),
    ]

    application = models.OneToOneField(
        StudentApplication,
        on_delete=models.CASCADE,
        related_name="screening_decision",
    )
    ai_score = models.IntegerField()
    jamb_component = models.IntegerField()
    olevel_component = models.IntegerField()
    sitting_component = models.IntegerField()
    recency_component = models.IntegerField()
    qualified = models.BooleanField()
    confidence = models.CharField(max_length=32, choices=CONFIDENCE_CHOICES)
    recommendation = models.CharField(max_length=32, choices=RECOMMENDATION_CHOICES)
    reasoning = models.TextField()
    chain_of_thought = models.JSONField(default=list)
    factors_used = models.JSONField(default=list)
    bias_flag = models.BooleanField(default=False)
    bias_explanation = models.TextField(blank=True, null=True)
    
    # Audit Fields (Independent Verification)
    audit_passed = models.BooleanField(default=True)
    audit_remarks = models.TextField(blank=True, null=True)
    identified_risks = models.JSONField(default=list)
    
    screened_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["qualified"]),
            models.Index(fields=["recommendation"]),
        ]

    def __str__(self):
        return f"Decision for {self.application.reference_number} (score={self.ai_score})"
