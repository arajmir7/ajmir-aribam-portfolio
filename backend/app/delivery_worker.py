"""Long-running worker for PostgreSQL-backed inquiry email deliveries."""

import signal
import time

from app.core.config import get_settings
from app.core.logging import log
from app.services.email_outbox import process_one


def run() -> None:
    stopping = False

    def stop(_signum, _frame):
        nonlocal stopping
        stopping = True

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    previous_status = None
    while not stopping:
        settings = get_settings()
        if settings.email_status != "configured":
            if previous_status != settings.email_status:
                log("email_delivery_not_ready", "worker", status=settings.email_status)
                previous_status = settings.email_status
            time.sleep(15)
            continue
        previous_status = settings.email_status
        try:
            worked = process_one(settings=settings)
        except Exception as error:
            log("email_worker_error", "worker", error_type=type(error).__name__)
            worked = False
        if not worked:
            time.sleep(2)


if __name__ == "__main__":
    run()
