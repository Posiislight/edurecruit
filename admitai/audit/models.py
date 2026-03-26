from django.db import models

from accounts.models import Officer
from applications.models import StudentApplication


class AuditLog(models.Model):
    DEC_ADMITTED = "admitted"
    DEC_REJECTED = "rejected"
    DEC_REVIEW = "review"
    DECISION_CHOICES = [
        (DEC_ADMITTED, "Admitted"),
        (DEC_REJECTED, "Rejected"),
        (DEC_REVIEW, "Review"),
    ]

    application = models.ForeignKey(
        StudentApplication,
        on_delete=models.CASCADE,
        related_name="audit_entries",
    )
    decision = models.CharField(max_length=32, choices=DECISION_CHOICES)
    ai_recommendation = models.CharField(max_length=32)
    ai_score = models.IntegerField()
    decided_by = models.ForeignKey(
        Officer,
        on_delete=models.PROTECT,
        related_name="audit_decisions",
    )
    override_reason = models.TextField(blank=True, null=True)
    is_override = models.BooleanField(default=False)
    decided_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-decided_at"]
        indexes = [
            models.Index(fields=["decided_at"]),
            models.Index(fields=["is_override"]),
        ]

    def __str__(self):
        return f"{self.application.reference_number} → {self.decision} @ {self.decided_at}"
