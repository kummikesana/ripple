"""LangGraph definition for the three-perspective sustainability assistant.

No external web search — perspectives are drawn from the selected LLM's own
general knowledge (see config.py for provider/model/API-key setup).

Graph shape (detailed mode):

                ┌───────┐
                │ START │
                └─┬──┬──┬┘
          ┌───────┘  │  └───────┐
          v          v          v
      ┌───────┐  ┌────────┐ ┌─────────┐
      │ people │  │ planet │ │ economy │   (run in parallel)
      └───┬────┘  └───┬────┘ └────┬────┘
          └────────────┼───────────┘
                        v  (barrier: waits for all three)
                 ┌─────────────┐
                 │ synthesize  │
                 └──────┬──────┘
                        v
                      ┌───┐
                      │END│
                      └───┘

Quick mode (`ask_quick`) skips the graph entirely and makes a single LLM call
that considers all three lenses at once — faster, but not three independently
generated perspectives.
"""

from __future__ import annotations

from typing import TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph

from .llm import content_to_text, get_llm
from .personas import PERSONAS


class AssistantState(TypedDict, total=False):
    question: str
    people_answer: str
    planet_answer: str
    economy_answer: str
    synthesis: str


def make_persona_node(persona_key: str, output_key: str):
    persona = PERSONAS[persona_key]

    def node(state: AssistantState) -> dict:
        messages = [
            SystemMessage(content=persona["system_prompt"]),
            HumanMessage(
                content=f"Evaluate this sustainability question:\n\n{state['question']}"
            ),
        ]
        response = get_llm(temperature=0.3).invoke(messages)
        return {output_key: response.content}

    return node


def synthesize(state: AssistantState) -> dict:
    system = SystemMessage(
        content=(
            "You synthesize three independent sustainability perspectives: People, "
            "Planet, and Economy. Do not invent a single verdict or flatten the "
            "views into one. In 3-5 sentences, explain where they agree, where "
            "they are in tension, and what trade-off the user should consider. "
            "Be concise and neutral."
        )
    )
    human = HumanMessage(
        content=(
            f"Question: {state['question']}\n\n"
            f"People perspective (Juno):\n{state['people_answer']}\n\n"
            f"Planet perspective (Moss):\n{state['planet_answer']}\n\n"
            f"Economy perspective (Penny):\n{state['economy_answer']}"
        )
    )
    response = get_llm(temperature=0.2).invoke([system, human])
    return {"synthesis": response.content}


def build_graph():
    graph = StateGraph(AssistantState)

    graph.add_node("people", make_persona_node("people", "people_answer"))
    graph.add_node("planet", make_persona_node("planet", "planet_answer"))
    graph.add_node("economy", make_persona_node("economy", "economy_answer"))
    graph.add_node("synthesize", synthesize)

    graph.add_edge(START, "people")
    graph.add_edge(START, "planet")
    graph.add_edge(START, "economy")

    # Barrier: synthesis starts only once all three persona nodes finish.
    graph.add_edge(["people", "planet", "economy"], "synthesize")
    graph.add_edge("synthesize", END)

    return graph.compile()


_APP = build_graph()


def ask_quick(question: str) -> str:
    """Single LLM call considering People, Planet, and Economy together."""
    system = SystemMessage(
        content=(
            "You are a sustainability analyst. Evaluate the user's question through "
            "three dimensions: PEOPLE (wellbeing, equity, labor and community), "
            "PLANET (emissions, biodiversity, pollution and resource use), and "
            "ECONOMY (cost, affordability, jobs and long-term viability). "
            "Give a concise, balanced answer. Use clear headings or bullets where "
            "helpful. Explain important trade-offs and flag uncertainty. Do not "
            "invent facts, statistics, or sources."
        )
    )
    human = HumanMessage(content=question)
    response = get_llm(temperature=0.3).invoke([system, human])
    return content_to_text(response.content)


def ask_detailed(question: str) -> dict:
    """Run the full three-persona graph and return each perspective plus a synthesis."""
    result = _APP.invoke({"question": question})
    return {
        "people_answer": content_to_text(result["people_answer"]),
        "planet_answer": content_to_text(result["planet_answer"]),
        "economy_answer": content_to_text(result["economy_answer"]),
        "synthesis": content_to_text(result["synthesis"]),
    }
