from django.db import models


class Programme(models.Model):
    name = models.CharField(max_length=255)
    faculty = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    jamb_cutoff = models.IntegerField()
    available_slots = models.IntegerField()
    required_subjects = models.JSONField(default=list)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["is_active", "name"]),
        ]

    def __str__(self):
        return self.name
