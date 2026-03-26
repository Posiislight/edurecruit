import random

from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone

from applications.models import StudentApplication


def _generate_reference_number() -> str:
    year = timezone.now().year
    suffix = f"{random.randint(0, 999_999):06d}"
    return f"ADMITAI-{year}-{suffix}"


@receiver(pre_save, sender=StudentApplication)
def assign_reference_number(sender, instance, **kwargs):
    if instance.reference_number:
        return
    for _ in range(50):
        candidate = _generate_reference_number()
        if not StudentApplication.objects.filter(reference_number=candidate).exists():
            instance.reference_number = candidate
            return
    raise RuntimeError("Could not allocate unique reference number")
