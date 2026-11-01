"""Sustainability assistant — People / Planet / Economy perspectives.

Public API for use from the main app:

    from sustainability_assistant import ask_quick, ask_detailed, PERSONAS

    ask_quick("Is buying an EV more sustainable than keeping an old gas car?")
    ask_detailed("Is buying an EV more sustainable than keeping an old gas car?")

See config.py for the environment variables this module expects the host
app to set (no .env file is read, written, or required).
"""

from .graph import ask_detailed, ask_quick, build_graph
from .personas import PERSONAS

__all__ = ["ask_quick", "ask_detailed", "build_graph", "PERSONAS"]
