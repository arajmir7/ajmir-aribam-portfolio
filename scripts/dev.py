"""Run reload servers together and reap each process tree on exit."""

import os
import signal
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def stop_group(process: subprocess.Popen) -> None:
    try:
        os.killpg(process.pid, signal.SIGTERM)
    except ProcessLookupError:
        return
    if process.poll() is None:
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            pass
    try:
        os.killpg(process.pid, 0)
    except ProcessLookupError:
        return
    else:
        os.killpg(process.pid, signal.SIGKILL)
        if process.poll() is None:
            process.wait()


def main() -> int:
    def stop_on_term(_signum, _frame):
        raise KeyboardInterrupt

    signal.signal(signal.SIGTERM, stop_on_term)
    processes: list[subprocess.Popen] = []
    development_environment = os.environ.copy()
    development_environment["APP_ENV"] = "development"
    # Ordinary local development must never send to a real Resend account.
    for key in ("RESEND_API_KEY", "CONTACT_EMAIL_FROM", "CONTACT_EMAIL_TO"):
        development_environment.pop(key, None)
    api_port = os.environ.get("PORTFOLIO_API_PORT", "8000")
    web_port = os.environ.get("PORT", "3000")
    try:
        processes.append(
            subprocess.Popen(
                [
                    "uv",
                    "run",
                    "uvicorn",
                    "app.main:app",
                    "--reload",
                    "--host",
                    "127.0.0.1",
                    "--port",
                    api_port,
                ],
                cwd=ROOT / "backend",
                start_new_session=True,
                env=development_environment,
            )
        )
        processes.append(
            subprocess.Popen(
                ["npm", "run", "dev", "--", "--hostname", "127.0.0.1", "--port", web_port],
                cwd=ROOT / "frontend",
                start_new_session=True,
                env=development_environment,
            )
        )
        while True:
            for process in processes:
                code = process.poll()
                if code is not None:
                    return code
            time.sleep(0.25)
    except KeyboardInterrupt:
        return 130
    finally:
        for process in processes:
            stop_group(process)


if __name__ == "__main__":
    sys.exit(main())
