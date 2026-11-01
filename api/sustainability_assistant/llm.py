from functools import lru_cache

from langchain.chat_models import init_chat_model

from . import config


@lru_cache(maxsize=4)
def get_llm(temperature: float = 0.3):
    provider = config.get_provider()
    model = config.get_model(provider)
    config.ensure_api_key_present(provider)
    return init_chat_model(
        model,
        model_provider=provider,
        temperature=temperature,
        timeout=60,
        max_retries=1,
    )


def content_to_text(content) -> str:
    """Normalize a LangChain message's .content into plain text.

    Most providers return a plain string. Some (certain Gemini responses
    among them) return a list of content blocks instead — this flattens
    either shape into a single string.
    """
    if isinstance(content, str):
        return content

    if isinstance(content, list):
        return "\n\n".join(
            block["text"]
            for block in content
            if isinstance(block, dict) and isinstance(block.get("text"), str)
        )

    return str(content)
