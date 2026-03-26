from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import Officer
from applications.models import StudentApplication
from applications.services import submit_application_and_screen
from audit.models import AuditLog
from programmes.models import Programme


def _olevel(**grades):
    return [{"subject": k, "grade": v} for k, v in grades.items()]


class Command(BaseCommand):
    help = "Seed demo programmes, an admin officer, and sample applications (dev only)."

    def handle(self, *args, **options):
        with transaction.atomic():
            AuditLog.objects.all().delete()
            Officer.objects.filter(email="officer@university.edu").delete()
            admin_user = Officer.objects.create_user(
                username="officer@university.edu",
                email="officer@university.edu",
                password="password123",
                full_name="AdmitAI Admin",
                university="Demo University",
                role=Officer.ROLE_ADMIN,
            )

            Programme.objects.all().delete()
            programmes_data = [
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
            programmes = [Programme.objects.create(**row) for row in programmes_data]

            StudentApplication.objects.all().delete()

            samples = [
                ("Ada Okafor", "ada1@example.com", 0, 265, 2023, 1, _olevel(**{"English Language": "B3", "Mathematics": "B2", "Physics": "C4", "Chemistry": "C5", "Biology": "B3"})),
                ("Chidi Eze", "chidi2@example.com", 1, 290, 2024, 1, _olevel(**{"English Language": "A1", "Mathematics": "A1", "Physics": "B2", "Chemistry": "B2", "Biology": "A1"})),
                ("Fatima Ibrahim", "fatima3@example.com", 2, 275, 2022, 2, _olevel(**{"English Language": "B2", "Mathematics": "C4", "Literature in English": "B3", "Government": "C4", "Economics": "C5"})),
                ("Emeka Nwosu", "emeka4@example.com", 3, 245, 2021, 2, _olevel(**{"English Language": "C5", "Mathematics": "B3", "Physics": "C4", "Chemistry": "C6"})),
                ("Grace Okon", "grace5@example.com", 4, 235, 2020, 1, _olevel(**{"English Language": "C4", "Mathematics": "B3", "Economics": "B3", "Government": "C5"})),
                ("Hassan Musa", "hassan6@example.com", 0, 230, 2024, 1, _olevel(**{"English Language": "B3", "Mathematics": "C5", "Physics": "C5", "Chemistry": "C6"})),
                ("Ifeanyi Obi", "ifeanyi7@example.com", 1, 300, 2023, 1, _olevel(**{"English Language": "A1", "Mathematics": "A1", "Physics": "A1", "Chemistry": "B2", "Biology": "A1"})),
                ("Jumoke Adeyemi", "jumoke8@example.com", 2, 268, 2019, 2, _olevel(**{"English Language": "C4", "Mathematics": "C5", "Literature in English": "C5", "Government": "C6"})),
                ("Kelechi Dike", "kelechi9@example.com", 3, 238, 2024, 1, _olevel(**{"English Language": "B3", "Mathematics": "B3", "Physics": "C4", "Chemistry": "B3"})),
                ("Lola Bankole", "lola10@example.com", 4, 228, 2023, 1, _olevel(**{"English Language": "C5", "Mathematics": "C4", "Economics": "C4", "Government": "C5"})),
                ("Musa Garba", "musa11@example.com", 0, 215, 2022, 2, _olevel(**{"English Language": "C6", "Mathematics": "C5", "Physics": "C6", "Chemistry": "C6"})),
                ("Ngozi Eze", "ngozi12@example.com", 1, 285, 2024, 1, _olevel(**{"English Language": "B2", "Mathematics": "B2", "Physics": "B3", "Chemistry": "B3", "Biology": "B2"})),
                ("Obinna Okafor", "obinna13@example.com", 2, 272, 2021, 1, _olevel(**{"English Language": "B3", "Mathematics": "C5", "Literature in English": "B3", "Government": "B3"})),
                ("Patience Udo", "patience14@example.com", 3, 250, 2023, 1, _olevel(**{"English Language": "B3", "Mathematics": "B2", "Physics": "B3", "Chemistry": "C4"})),
                ("Quadri Salisu", "quadri15@example.com", 4, 240, 2024, 1, _olevel(**{"English Language": "C4", "Mathematics": "B3", "Economics": "B2", "Government": "C4"})),
                ("Ruth Akpan", "ruth16@example.com", 0, 225, 2018, 2, _olevel(**{"English Language": "C5", "Mathematics": "C5", "Physics": "C5", "Chemistry": "C5"})),
                ("Segun Falana", "segun17@example.com", 1, 295, 2023, 1, _olevel(**{"English Language": "A1", "Mathematics": "B2", "Physics": "A1", "Chemistry": "B2", "Biology": "A1"})),
                ("Titi Ogun", "titi18@example.com", 2, 260, 2020, 2, _olevel(**{"English Language": "C5", "Mathematics": "C6", "Literature in English": "C5", "Government": "C5"})),
                ("Uche Nnamdi", "uche19@example.com", 3, 255, 2024, 1, _olevel(**{"English Language": "B3", "Mathematics": "B3", "Physics": "C4", "Chemistry": "B3"})),
                ("Yemi Ade", "yemi20@example.com", 4, 232, 2022, 1, _olevel(**{"English Language": "B3", "Mathematics": "C4", "Economics": "C5", "Government": "C4"})),
            ]

            states = ["Lagos", "Kano", "Rivers", "Enugu", "Oyo"] * 4

            for i, (name, email, pidx, jamb, year, sittings, olevel) in enumerate(samples):
                app = StudentApplication(
                    student_name=name,
                    email=email,
                    phone=f"080{10000000 + i:08d}",
                    state_of_origin=states[i],
                    programme=programmes[pidx],
                    jamb_score=jamb,
                    olevel_results=olevel,
                    number_of_sittings=sittings,
                    result_year=year,
                    status=StudentApplication.STATUS_PENDING,
                )
                app.save()
                # submit_application_and_screen(app)

        self.stdout.write(self.style.SUCCESS(f"Seeded admin {admin_user.email} and demo data."))
