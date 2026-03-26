from django.contrib.auth.models import AbstractUser
from django.db import models


class Officer(AbstractUser):
    ROLE_ADMISSIONS = "admissions_officer"
    ROLE_SENIOR = "senior_officer"
    ROLE_ADMIN = "admin"
    ROLE_CHOICES = [
        (ROLE_ADMISSIONS, "Admissions officer"),
        (ROLE_SENIOR, "Senior officer"),
        (ROLE_ADMIN, "Admin"),
    ]

    full_name = models.CharField(max_length=255)
    university = models.CharField(max_length=255)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default=ROLE_ADMISSIONS)

    class Meta:
        indexes = [
            models.Index(fields=["role"]),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.email})"
