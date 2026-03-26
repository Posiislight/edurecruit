from django.contrib import admin

from programmes.models import Programme


@admin.register(Programme)
class ProgrammeAdmin(admin.ModelAdmin):
    list_display = ("name", "faculty", "jamb_cutoff", "is_active", "created_at")
