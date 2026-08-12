"""Unit tests for agents/orchestrator.py and the workflow classes it wraps.

These exercise the real WorkflowOrchestrator / workflow classes but stub out
`workflow_instance.stream(...)` so no LangGraph node actually runs (which
would otherwise call out to the OpenAI API). That keeps the tests fast,
free, and deterministic while still exercising all of the real
state-construction / message-handling code around the graph.
"""
import pytest
from fastapi import HTTPException
from langgraph.checkpoint.memory import MemorySaver

from agents.orchestrator import WorkflowOrchestrator
from agents.workflows.analyst.index import AnalystWorkflow
from agents.workflows.coder.index import CoderWorkflow
from agents.workflows.researcher.index import ResearchWorkflow

# name -> (workflow class, a valid seed state dict matching its WorkflowState)
WORKFLOW_CASES = {
    "analyst": (
        AnalystWorkflow,
        {
            "messages": [],
            "user_prompt": "",
            "company_name": "",
            "context": "",
            "mermaid_diagram": "",
            "file": None,
        },
    ),
    "researcher": (
        ResearchWorkflow,
        {
            "messages": [],
            "mermaid_input": "",
            "altered_mermaid": "",
            "options": [],
            "output": {},
            "finished": False,
        },
    ),
    "coder": (
        CoderWorkflow,
        {
            "wallet_id": "test-wallet",
            "messages": [],
            "usecase": "",
            "feature_list": [],
            "plan_messages": [],
            "code_messages": [],
            "generated_code": "",
            "plan": {},
            "token_name": "",
            "token_abbreviation": "",
            "contract_address": "",
        },
    ),
}


def _stub_stream(monkeypatch, workflow, fake_event):
    """Replaces the compiled graph's .stream() with one that yields a single
    canned event, so .start()/.chat() never actually executes a graph node."""

    def fake_stream(state, config, stream_mode="values"):
        yield fake_event

    monkeypatch.setattr(workflow.workflow_instance, "stream", fake_stream)


class TestOrchestratorRouting:
    def test_getAll_lists_the_three_registered_agents(self):
        orchestrator = WorkflowOrchestrator()
        assert orchestrator.getAll() == ["analyst", "researcher", "coder"]

    def test_start_with_unknown_workflow_raises_404(self):
        orchestrator = WorkflowOrchestrator()
        with pytest.raises(HTTPException) as exc_info:
            orchestrator.start("not-a-real-workflow")
        assert exc_info.value.status_code == 404

    def test_chat_with_unknown_workflow_raises_404(self):
        orchestrator = WorkflowOrchestrator()
        with pytest.raises(HTTPException) as exc_info:
            orchestrator.chat("not-a-real-workflow", "thread-1", {"content": "hi"})
        assert exc_info.value.status_code == 404

    def test_get_state_with_unknown_workflow_raises_404(self):
        orchestrator = WorkflowOrchestrator()
        with pytest.raises(HTTPException) as exc_info:
            orchestrator.get_state("not-a-real-workflow", "thread-1")
        assert exc_info.value.status_code == 404


class TestMessagePassingRegression:
    """
    Regression tests for a bug where every workflow .start()/.chat() call
    that included a message crashed with:

        TypeError: the JSON object must be str, bytes or bytearray, not dict

    The route layer (routes/_common.py) already parses the incoming
    stringified-JSON `message` form field into a dict before it reaches the
    orchestrator; every workflow's start()/chat() then called json.loads() on
    that dict *again*, which always raised. This meant starting or
    continuing *any* of the three agent conversations with an actual message
    was completely broken. Covers all three workflows since each had its own
    copy of the same bug.
    """

    @pytest.mark.parametrize("name", WORKFLOW_CASES.keys())
    def test_start_accepts_an_already_parsed_dict_message(self, name, monkeypatch):
        cls, _seed = WORKFLOW_CASES[name]
        workflow = cls(MemorySaver())
        _stub_stream(monkeypatch, workflow, {"stubbed": True})

        thread_id, state = workflow.start(
            {"content": "Let's get started", "type": "human", "role": "user"}
        )

        assert isinstance(thread_id, str) and thread_id
        assert state == {"stubbed": True}

    @pytest.mark.parametrize("name", WORKFLOW_CASES.keys())
    def test_chat_accepts_an_already_parsed_dict_message(self, name, monkeypatch):
        cls, seed = WORKFLOW_CASES[name]
        workflow = cls(MemorySaver())
        thread_id = "regression-thread"
        config = {"configurable": {"thread_id": thread_id}}
        # Seed a prior state for this thread, as if the workflow had already
        # started and is now paused waiting for the user's next message.
        workflow.workflow_instance.update_state(config, seed)
        _stub_stream(monkeypatch, workflow, {"stubbed": True})

        result = workflow.chat(
            thread_id, {"content": "sounds good", "type": "human", "role": "user"}
        )

        assert result == {"stubbed": True}

    @pytest.mark.parametrize("name", WORKFLOW_CASES.keys())
    def test_orchestrator_start_forwards_dict_message_end_to_end(self, name, monkeypatch):
        """Same regression, but entered through WorkflowOrchestrator.start()
        the way the /workflow route actually calls it."""
        orchestrator = WorkflowOrchestrator()
        _stub_stream(monkeypatch, orchestrator.agents[name], {"stubbed": True})

        thread_id, state = orchestrator.start(
            name, {"content": "hello", "type": "human", "role": "user"}
        )

        assert isinstance(thread_id, str) and thread_id
        assert state == {"stubbed": True}
