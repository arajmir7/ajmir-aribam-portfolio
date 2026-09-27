#!/usr/bin/env python3
"""Loopback-only fake Resend endpoint for the isolated contact integration check."""

import hashlib
import json
import os
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

api_key = os.environ["RESEND_API_KEY"]
capture_path = Path(os.environ["MOCK_RESEND_CAPTURE"])
messages: dict[str, tuple[str, dict]] = {}
lock = threading.Lock()


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/health":
            self.send_error(404)
            return
        response = b'{"status":"ready"}'
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(response)))
        self.end_headers()
        self.wfile.write(response)

    def do_POST(self):
        if self.path != "/emails":
            self.send_error(404)
            return
        if self.headers.get("Authorization") != f"Bearer {api_key}":
            self.send_error(403)
            return
        idempotency_key = self.headers.get("Idempotency-Key", "")
        if not idempotency_key or len(idempotency_key) > 256:
            self.send_error(400)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 64_000:
                self.send_error(413)
                return
            payload = json.loads(self.rfile.read(length))
        except (ValueError, json.JSONDecodeError):
            self.send_error(400)
            return
        if not all(
            isinstance(payload.get(key), str) and payload[key]
            for key in ("from", "reply_to", "subject", "text")
        ) or payload.get("to") != ["qa-inbox@example.com"]:
            self.send_error(422)
            return
        if "QA_FORCE_RESEND_503" in payload["text"]:
            response = b'{"message":"simulated provider outage"}'
            self.send_response(503)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(response)))
            self.end_headers()
            self.wfile.write(response)
            return
        message_id = "qa_" + hashlib.sha256(idempotency_key.encode()).hexdigest()[:32]
        with lock:
            previous = messages.get(idempotency_key)
            if previous and previous[1] != payload:
                self.send_error(409)
                return
            messages[idempotency_key] = (message_id, payload)
            capture_path.write_text(json.dumps(list(messages.values())), encoding="utf-8")
        response = json.dumps({"id": message_id}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(response)))
        self.end_headers()
        self.wfile.write(response)

    def log_message(self, _format, *_args):
        return


server = ThreadingHTTPServer(
    ("127.0.0.1", int(os.environ.get("MOCK_RESEND_PORT", "8010"))), Handler
)
server.serve_forever()
