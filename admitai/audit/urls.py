from django.urls import path

from audit.views import AuditLogExportView, AuditLogListView

urlpatterns = [
    path("", AuditLogListView.as_view()),
    path("export/", AuditLogExportView.as_view()),
]
