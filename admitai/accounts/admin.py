from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from accounts.models import Officer


@admin.register(Officer)
class OfficerAdmin(DjangoUserAdmin):
    list_display = ("email", "username", "full_name", "university", "role", "is_staff")
    fieldsets = DjangoUserAdmin.fieldsets + (("AdmitAI", {"fields": ("full_name", "university", "role")}),)
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        (None, {"fields": ("full_name", "university", "role")}),
    )
