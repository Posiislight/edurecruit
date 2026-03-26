from django.db import models

from programmes.models import Programme


class StudentApplication(models.Model):
    STATUS_PENDING = "pending"
    STATUS_SCREENED = "screened"
    STATUS_ADMITTED = "admitted"
    STATUS_REJECTED = "rejected"
    STATUS_REVIEW = "review"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_SCREENED, "Screened"),
        (STATUS_ADMITTED, "Admitted"),
        (STATUS_REJECTED, "Rejected"),
        (STATUS_REVIEW, "Review"),
    ]

    SITTING_ONE = 1
    SITTING_TWO = 2
    SITTING_CHOICES = [
        (SITTING_ONE, "One sitting"),
        (SITTING_TWO, "Two sittings"),
    ]

    reference_number = models.CharField(max_length=32, unique=True, db_index=True, blank=True, default="")
    student_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=32)
    state_of_origin = models.CharField(max_length=128)
    programme = models.ForeignKey(
        Programme,
        on_delete=models.PROTECT,
        related_name="applications",
    )
    jamb_score = models.IntegerField()
    olevel_results = models.JSONField(default=list)
    number_of_sittings = models.IntegerField(choices=SITTING_CHOICES)
    result_year = models.IntegerField()
    transcript_upload = models.FileField(upload_to="transcripts/", blank=True, null=True)
    id_upload = models.FileField(upload_to="ids/", blank=True, null=True)
    status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        db_index=True,
    )
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["programme"]),
            models.Index(fields=["submitted_at"]),
        ]

    def __str__(self):
        return f"{self.reference_number} — {self.student_name}"
