import django_filters as filters

from applications.models import StudentApplication


class StudentApplicationFilter(filters.FilterSet):
    programme = filters.NumberFilter(field_name="programme_id")
    status = filters.CharFilter()
    confidence = filters.CharFilter(field_name="screening_decision__confidence")
    recommendation = filters.CharFilter(field_name="screening_decision__recommendation")
    reference_number = filters.CharFilter(lookup_expr="iexact")
    email = filters.CharFilter(lookup_expr="iexact")
    search = filters.CharFilter(field_name="student_name", lookup_expr="icontains")

    class Meta:
        model = StudentApplication
        fields = ("programme", "status", "confidence", "recommendation", "reference_number", "email", "search")
