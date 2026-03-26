from __future__ import annotations

from collections import Counter

from django.core.management.base import BaseCommand

from accounts.models import Officer
from applications.models import StudentApplication
from applications.services import submit_application_and_screen
from audit.models import AuditLog
from programmes.models import Programme
from screening.demo import demo_screen_application
from screening.models import AdmissionsDecision

DEMO_ADMIN_EMAIL = "officer@university.edu"
DEMO_ADMIN_PASSWORD = "password123"


def _olevel(**grades):
    return [{"subject": subject, "grade": grade} for subject, grade in grades.items()]


PROGRAMMES_DATA = [
    {
        "name": "Computer Science",
        "faculty": "Physical Sciences",
        "description": "B.Sc. Computer Science — software engineering and computing fundamentals.",
        "jamb_cutoff": 220,
        "available_slots": 120,
        "required_subjects": [
            "Mathematics",
            "English Language",
            "Physics",
            "Chemistry",
        ],
    },
    {
        "name": "Medicine and Surgery",
        "faculty": "Clinical Sciences",
        "description": "MBBS programme.",
        "jamb_cutoff": 280,
        "available_slots": 50,
        "required_subjects": [
            "Mathematics",
            "English Language",
            "Physics",
            "Chemistry",
            "Biology",
        ],
    },
    {
        "name": "Law",
        "faculty": "Law",
        "description": "LL.B. programme.",
        "jamb_cutoff": 270,
        "available_slots": 80,
        "required_subjects": [
            "Mathematics",
            "English Language",
            "Literature in English",
            "Government",
        ],
    },
    {
        "name": "Electrical Engineering",
        "faculty": "Engineering",
        "description": "B.Eng. Electrical Engineering.",
        "jamb_cutoff": 240,
        "available_slots": 90,
        "required_subjects": [
            "Mathematics",
            "English Language",
            "Physics",
            "Chemistry",
        ],
    },
    {
        "name": "Economics",
        "faculty": "Social Sciences",
        "description": "B.Sc. Economics.",
        "jamb_cutoff": 230,
        "available_slots": 100,
        "required_subjects": [
            "Mathematics",
            "English Language",
            "Economics",
            "Government",
        ],
    },
]

SAMPLES = [
    (
        "Ada Okafor",
        "ada1@example.com",
        0,
        265,
        2023,
        1,
        _olevel(
            **{
                "English Language": "B3",
                "Mathematics": "B2",
                "Physics": "C4",
                "Chemistry": "C5",
                "Biology": "B3",
            }
        ),
    ),
    (
        "Chidi Eze",
        "chidi2@example.com",
        1,
        290,
        2024,
        1,
        _olevel(
            **{
                "English Language": "A1",
                "Mathematics": "A1",
                "Physics": "B2",
                "Chemistry": "B2",
                "Biology": "A1",
            }
        ),
    ),
    (
        "Fatima Ibrahim",
        "fatima3@example.com",
        2,
        275,
        2022,
        2,
        _olevel(
            **{
                "English Language": "B2",
                "Mathematics": "C4",
                "Literature in English": "B3",
                "Government": "C4",
                "Economics": "C5",
            }
        ),
    ),
    (
        "Emeka Nwosu",
        "emeka4@example.com",
        3,
        245,
        2021,
        2,
        _olevel(
            **{
                "English Language": "C5",
                "Mathematics": "B3",
                "Physics": "C4",
                "Chemistry": "C6",
            }
        ),
    ),
    (
        "Grace Okon",
        "grace5@example.com",
        4,
        235,
        2020,
        1,
        _olevel(
            **{
                "English Language": "C4",
                "Mathematics": "B3",
                "Economics": "B3",
                "Government": "C5",
            }
        ),
    ),
    (
        "Hassan Musa",
        "hassan6@example.com",
        0,
        230,
        2024,
        1,
        _olevel(
            **{
                "English Language": "B3",
                "Mathematics": "C5",
                "Physics": "C5",
                "Chemistry": "C6",
            }
        ),
    ),
    (
        "Ifeanyi Obi",
        "ifeanyi7@example.com",
        1,
        300,
        2023,
        1,
        _olevel(
            **{
                "English Language": "A1",
                "Mathematics": "A1",
                "Physics": "A1",
                "Chemistry": "B2",
                "Biology": "A1",
            }
        ),
    ),
    (
        "Jumoke Adeyemi",
        "jumoke8@example.com",
        2,
        268,
        2019,
        2,
        _olevel(
            **{
                "English Language": "C4",
                "Mathematics": "C5",
                "Literature in English": "C5",
                "Government": "C6",
            }
        ),
    ),
    (
        "Kelechi Dike",
        "kelechi9@example.com",
        3,
        238,
        2024,
        1,
        _olevel(
            **{
                "English Language": "B3",
                "Mathematics": "B3",
                "Physics": "C4",
                "Chemistry": "B3",
            }
        ),
    ),
    (
        "Lola Bankole",
        "lola10@example.com",
        4,
        228,
        2023,
        1,
        _olevel(
            **{
                "English Language": "C5",
                "Mathematics": "C4",
                "Economics": "C4",
                "Government": "C5",
            }
        ),
    ),
    (
        "Musa Garba",
        "musa11@example.com",
        0,
        215,
        2022,
        2,
        _olevel(
            **{
                "English Language": "C6",
                "Mathematics": "C5",
                "Physics": "C6",
                "Chemistry": "C6",
            }
        ),
    ),
    (
        "Ngozi Eze",
        "ngozi12@example.com",
        1,
        285,
        2024,
        1,
        _olevel(
            **{
                "English Language": "B2",
                "Mathematics": "B2",
                "Physics": "B3",
                "Chemistry": "B3",
                "Biology": "B2",
            }
        ),
    ),
    (
        "Obinna Okafor",
        "obinna13@example.com",
        2,
        272,
        2021,
        1,
        _olevel(
            **{
                "English Language": "B3",
                "Mathematics": "C5",
                "Literature in English": "B3",
                "Government": "B3",
            }
        ),
    ),
    (
        "Patience Udo",
        "patience14@example.com",
        3,
        250,
        2023,
        1,
        _olevel(
            **{
                "English Language": "B3",
                "Mathematics": "B2",
                "Physics": "B3",
                "Chemistry": "C4",
            }
        ),
    ),
    (
        "Quadri Salisu",
        "quadri15@example.com",
        4,
        240,
        2024,
        1,
        _olevel(
            **{
                "English Language": "C4",
                "Mathematics": "B3",
                "Economics": "B2",
                "Government": "C4",
            }
        ),
    ),
    (
        "Ruth Akpan",
        "ruth16@example.com",
        0,
        225,
        2018,
        2,
        _olevel(
            **{
                "English Language": "C5",
                "Mathematics": "C5",
                "Physics": "C5",
                "Chemistry": "C5",
            }
        ),
    ),
    (
        "Segun Falana",
        "segun17@example.com",
        1,
        295,
        2023,
        1,
        _olevel(
            **{
                "English Language": "A1",
                "Mathematics": "B2",
                "Physics": "A1",
                "Chemistry": "B2",
                "Biology": "A1",
            }
        ),
    ),
    (
        "Titi Ogun",
        "titi18@example.com",
        2,
        260,
        2020,
        2,
        _olevel(
            **{
                "English Language": "C5",
                "Mathematics": "C6",
                "Literature in English": "C5",
                "Government": "C5",
            }
        ),
    ),
    (
        "Uche Nnamdi",
        "uche19@example.com",
        3,
        255,
        2024,
        1,
        _olevel(
            **{
                "English Language": "B3",
                "Mathematics": "B3",
                "Physics": "C4",
                "Chemistry": "B3",
            }
        ),
    ),
    (
        "Yemi Ade",
        "yemi20@example.com",
        4,
        232,
        2022,
        1,
        _olevel(
            **{
                "English Language": "B3",
                "Mathematics": "C4",
                "Economics": "C5",
                "Government": "C4",
            }
        ),
    ),
]

DEMO_EMAILS = [sample[1] for sample in SAMPLES]
PROGRAMME_NAMES = [programme["name"] for programme in PROGRAMMES_DATA]


def _needs_demo_fallback(decision: AdmissionsDecision | None) -> bool:
    return bool(
        decision
        and decision.ai_score == 0
        and decision.recommendation == AdmissionsDecision.REC_REVIEW
        and not decision.audit_passed
    )


class Command(BaseCommand):
    help = "Seed demo programmes, an admin officer, and screened sample applications."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing demo records managed by this command before reseeding.",
        )
        parser.add_argument(
            "--screening-mode",
            choices=("auto", "demo"),
            default="auto",
            help="Use live AI screening when available, or force deterministic demo screening.",
        )
        parser.add_argument(
            "--admin-password",
            default=DEMO_ADMIN_PASSWORD,
            help="Password for the demo admin officer.",
        )

    def handle(self, *args, **options):
        screening_mode = options["screening_mode"]
        admin_password = options["admin_password"]

        if options["reset"]:
            self._reset_demo_data()

        admin_user = self._seed_admin(admin_password)
        programmes = self._seed_programmes()
        decisions = self._seed_applications(programmes, screening_mode)

        recommendation_counts = Counter(decision.recommendation for decision in decisions)
        status_counts = Counter(
            StudentApplication.objects.filter(email__in=DEMO_EMAILS).values_list("status", flat=True)
        )

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
        self.stdout.write(f"Admin login: {admin_user.email} / {admin_password}")
        self.stdout.write(f"Programmes: {len(programmes)}")
        self.stdout.write(f"Applications: {len(decisions)}")
        self.stdout.write(
            "Recommendations: "
            f"admit={recommendation_counts.get(AdmissionsDecision.REC_ADMIT, 0)}, "
            f"review={recommendation_counts.get(AdmissionsDecision.REC_REVIEW, 0)}, "
            f"reject={recommendation_counts.get(AdmissionsDecision.REC_REJECT, 0)}"
        )
        self.stdout.write(
            "Statuses: "
            f"screened={status_counts.get(StudentApplication.STATUS_SCREENED, 0)}, "
            f"review={status_counts.get(StudentApplication.STATUS_REVIEW, 0)}, "
            f"pending={status_counts.get(StudentApplication.STATUS_PENDING, 0)}"
        )
        self.stdout.write(f"Screening mode used: {screening_mode}")

    def _reset_demo_data(self) -> None:
        AuditLog.objects.filter(decided_by__email=DEMO_ADMIN_EMAIL).delete()
        StudentApplication.objects.filter(email__in=DEMO_EMAILS).delete()
        Programme.objects.filter(name__in=PROGRAMME_NAMES, applications__isnull=True).delete()
        Officer.objects.filter(email=DEMO_ADMIN_EMAIL).delete()

    def _seed_admin(self, password: str) -> Officer:
        admin_user, _ = Officer.objects.get_or_create(
            username=DEMO_ADMIN_EMAIL,
            defaults={
                "email": DEMO_ADMIN_EMAIL,
                "full_name": "AdmitAI Admin",
                "university": "Demo University",
                "role": Officer.ROLE_ADMIN,
            },
        )
        admin_user.username = DEMO_ADMIN_EMAIL
        admin_user.email = DEMO_ADMIN_EMAIL
        admin_user.full_name = "AdmitAI Admin"
        admin_user.university = "Demo University"
        admin_user.role = Officer.ROLE_ADMIN
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.is_active = True
        admin_user.set_password(password)
        admin_user.save()
        return admin_user

    def _seed_programmes(self) -> list[Programme]:
        programmes: list[Programme] = []
        for row in PROGRAMMES_DATA:
            programme, _ = Programme.objects.update_or_create(
                name=row["name"],
                defaults=row,
            )
            programmes.append(programme)
        return programmes

    def _seed_applications(
        self,
        programmes: list[Programme],
        screening_mode: str,
    ) -> list[AdmissionsDecision]:
        decisions: list[AdmissionsDecision] = []
        states = ["Lagos", "Kano", "Rivers", "Enugu", "Oyo"] * 4

        for index, (name, email, programme_index, jamb, year, sittings, olevel) in enumerate(SAMPLES):
            app, _ = StudentApplication.objects.update_or_create(
                email=email,
                defaults={
                    "student_name": name,
                    "phone": f"080{10000000 + index:08d}",
                    "state_of_origin": states[index],
                    "programme": programmes[programme_index],
                    "jamb_score": jamb,
                    "olevel_results": olevel,
                    "number_of_sittings": sittings,
                    "result_year": year,
                    "status": StudentApplication.STATUS_PENDING,
                },
            )
            decisions.append(self._screen_application(app, screening_mode))

        return decisions

    def _screen_application(
        self,
        application: StudentApplication,
        screening_mode: str,
    ) -> AdmissionsDecision:
        if screening_mode == "demo":
            return demo_screen_application(application, application.programme)

        submit_application_and_screen(application)
        application.refresh_from_db()
        decision = getattr(application, "screening_decision", None)
        if _needs_demo_fallback(decision):
            return demo_screen_application(application, application.programme)
        if decision is None:
            return demo_screen_application(application, application.programme)
        return decision
