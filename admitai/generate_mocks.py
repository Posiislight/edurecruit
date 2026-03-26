import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admitai.settings')
django.setup()

from applications.models import StudentApplication
from programmes.models import Programme
from screening.engine import screen_application

# Get or create a default programme
programme = Programme.objects.first()
if not programme:
    programme = Programme.objects.create(
        name="B.Sc. Computer Science",
        code="CSC",
        faculty="Science",
        jamb_cutoff=200,
        required_subjects=["Mathematics", "English Language", "Physics", "Chemistry"]
    )

applicants = [
    {
        "student_name": "Aisha Bello",
        "email": "aisha.stellar@example.com",
        "phone": "08012345678",
        "state_of_origin": "Kano",
        "programme": programme,
        "jamb_score": 310,
        "olevel_results": [
            {"subject": "Mathematics", "grade": "A1"},
            {"subject": "English Language", "grade": "A1"},
            {"subject": "Physics", "grade": "A1"},
            {"subject": "Chemistry", "grade": "A1"},
            {"subject": "Biology", "grade": "B2"}
        ],
        "number_of_sittings": 1,
        "result_year": 2024
    },
    {
        "student_name": "Chukwuemeka Okoro",
        "email": "chuks.borderline@example.com",
        "phone": "08023456789",
        "state_of_origin": "Enugu",
        "programme": programme,
        "jamb_score": 215,
        "olevel_results": [
            {"subject": "Mathematics", "grade": "C5"},
            {"subject": "English Language", "grade": "C4"},
            {"subject": "Physics", "grade": "C6"},
            {"subject": "Chemistry", "grade": "C5"},
            {"subject": "Geography", "grade": "C4"}
        ],
        "number_of_sittings": 1,
        "result_year": 2024
    },
    {
        "student_name": "Fatima Musa",
        "email": "fatima.old@example.com",
        "phone": "08034567890",
        "state_of_origin": "Kaduna",
        "programme": programme,
        "jamb_score": 260,
        "olevel_results": [
            {"subject": "Mathematics", "grade": "B3"},
            {"subject": "English Language", "grade": "B2"},
            {"subject": "Physics", "grade": "B3"},
            {"subject": "Chemistry", "grade": "C4"}
        ],
        "number_of_sittings": 2,
        "result_year": 2018
    },
    {
        "student_name": "Adekunle Adeyemi",
        "email": "ade.fail@example.com",
        "phone": "08045678901",
        "state_of_origin": "Oyo",
        "programme": programme,
        "jamb_score": 180,  # Below cutoff!
        "olevel_results": [
            {"subject": "Mathematics", "grade": "A1"},
            {"subject": "English Language", "grade": "A1"},
            {"subject": "Physics", "grade": "A1"},
            {"subject": "Chemistry", "grade": "A1"}
        ],
        "number_of_sittings": 1,
        "result_year": 2024
    },
    {
        "student_name": "Ngozi Eze",
        "email": "ngozi.missing@example.com",
        "phone": "08056789012",
        "state_of_origin": "Anambra",
        "programme": programme,
        "jamb_score": 290,
        "olevel_results": [
            {"subject": "Mathematics", "grade": "A1"},
            {"subject": "Physics", "grade": "A1"},
            {"subject": "Chemistry", "grade": "A1"},
            {"subject": "Biology", "grade": "A1"}
        ],
        "number_of_sittings": 1,
        "result_year": 2024
    }
]

for data in applicants:
    print(f"Creating application for {data['student_name']}...")
    app = StudentApplication.objects.create(**data)
    decision = screen_application(app, app.programme)
    print(f"  -> Score: {decision.ai_score}, Recommendation: {decision.recommendation}")
    print(f"  -> Reason: {decision.reasoning}\n")
