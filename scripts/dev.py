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
    if not development_environment.get("EMAIL_HOST"):
        development_environment["EMAIL_HOST"] = "127.0.0.1"
        development_environment["EMAIL_PORT"] = "1025"
        development_environment["EMAIL_USER"] = ""
        development_environment["EMAIL_PASSWORD"] = ""
        development_environment["EMAIL_FROM"] = "Ajmir Aribam <no-reply@example.com>"
        development_environment["EMAIL_TO"] = "ajmir@example.com"
        development_environment["EMAIL_USE_TLS"] = "false"
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
                ["uv", "run", "python", "-m", "app.delivery_worker"],
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
