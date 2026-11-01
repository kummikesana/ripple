"""Environment-variable configuration for the sustainability assistant.

This module does NOT read from, write to, or look for a `.env` file. The
main app is responsible for setting these as real process environment
variables (shell export, process manager, container env, secrets manager,
CI/CD config, etc.) before importing/using this package.

--------------------------------------------------------------------------
Placeholders — set exactly the one API key for the provider you choose:

    GOOGLE_API_KEY           required when SUSTAINABILITY_PROVIDER=google_genai
    ANTHROPIC_API_KEY        required when SUSTAINABILITY_PROVIDER=anthropic
    OPENAI_API_KEY           required when SUSTAINABILITY_PROVIDER=openai

Optional overrides:

    SUSTAINABILITY_PROVIDER  "google_genai" | "anthropic" | "openai"
                             (default: "google_genai")
    SUSTAINABILITY_MODEL     overrides the default model for the chosen
                             provider
--------------------------------------------------------------------------
"""

import os

DEFAULT_PROVIDER = "google_genai"

MODEL_BY_PROVIDER = {
    "google_genai": "gemini-3.1-flash-lite",
    "anthropic": "claude-sonnet-5",
    "openai": "gpt-4o-mini",
}

API_KEY_ENV_VAR_BY_PROVIDER = {
    "google_genai": "GOOGLE_API_KEY",
    "anthropic": "ANTHROPIC_API_KEY",
    "openai": "OPENAI_API_KEY",
}


def get_provider() -> str:
    provider = os.environ.get("SUSTAINABILITY_PROVIDER", DEFAULT_PROVIDER)
    if provider not in MODEL_BY_PROVIDER:
        raise ValueError(f"Unsupported SUSTAINABILITY_PROVIDER: {provider!r}")
    return provider


def get_model(provider: str) -> str:
    return os.environ.get("SUSTAINABILITY_MODEL") or MODEL_BY_PROVIDER[provider]


def get_api_key_env_var(provider: str) -> str:
    return API_KEY_ENV_VAR_BY_PROVIDER[provider]


def ensure_api_key_present(provider: str) -> None:
    """Raise a clear error if the provider's API key isn't set.

    This never prompts for, stores, or persists the key itself — the host
    app must set it as a real environment variable ahead of time.
    """
    env_var = get_api_key_env_var(provider)
    if not os.environ.get(env_var):
        raise RuntimeError(
            f"{env_var} is not set. Set it as an environment variable before "
            f"using the sustainability assistant (provider={provider!r})."
        )
