"""Sanitized structured events; never include contact message or email values."""

import json
import logging

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("portfolio.inquiry")


def log(event: str, request_id: str, **fields: str | int) -> None:
    logger.info(
        json.dumps({"event": event, "request_id": request_id, **fields}, separators=(",", ":"))
    )
