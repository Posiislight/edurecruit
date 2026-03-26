from applications.models import StudentApplication


def submit_application_and_screen(application: StudentApplication) -> None:
    """Run screening after an application is saved; errors are swallowed by the engine."""
    from screening.engine import screen_application

    screen_application(application, application.programme)
