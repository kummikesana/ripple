"""Vercel serverless function: POST { question } -> the crew's three-perspective answer.

Wraps sustainability_assistant.ask_detailed (see ./sustainability_assistant/).
Requires GOOGLE_API_KEY set as a Vercel environment variable (Production and
Preview) — never exposed to the frontend, read only here on the server.
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))

from sustainability_assistant import ask_detailed  # noqa: E402

MAX_QUESTION_LEN = 300


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # CORS preflight: needed once this is called from a different origin
        # (the Capacitor-wrapped app), not just the Vercel deployment itself.
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0) or 0)
            raw = self.rfile.read(length) if length else b"{}"
            data = json.loads(raw or b"{}")
            question = (data.get("question") or "").strip()
        except Exception:
            self._send(400, {"error": "Couldn't read that question. Mind trying again?"})
            return

        if not question:
            self._send(400, {"error": "Looks like the question was empty."})
            return

        question = question[:MAX_QUESTION_LEN]

        try:
            result = ask_detailed(question)
        except Exception:
            self._send(502, {"error": "The crew couldn't think this one through just now. Please try again in a moment."})
            return

        self._send(200, result)

    def _send(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)
