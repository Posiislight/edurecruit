from django.urls import path

from screening.views import RescreenView, ScreeningResultView

urlpatterns = [
    path("<int:application_id>/", ScreeningResultView.as_view()),
    path("rescreen/<int:application_id>/", RescreenView.as_view()),
]
