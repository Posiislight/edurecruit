from django.contrib import admin

from applications.models import StudentApplication


@admin.register(StudentApplication)
class StudentApplicationAdmin(admin.ModelAdmin):
    list_display = ("reference_number", "student_name", "programme", "status", "submitted_at")
    list_filter = ("status", "programme")
