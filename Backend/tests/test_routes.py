"""HTTP-level tests for the /workflow and /stream routers.

The real WorkflowOrchestrator's registered agents are swapped out for an
in-memory fake for every test in this module, so requests never touch
LangGraph or the OpenAI API -- these tests are about the HTTP contract
(status codes, JSON envelope, request parsing/validation), not agent
behavior.
"""
import json

import pytest
from fastapi.testclient import TestClient

import main
from routes import stream_routes, workflow_routes


class FakeWorkflow:
    """A minimal stand-in for AnalystWorkflow/ResearchWorkflow/CoderWorkflow
    that records exactly what it was called with, so tests can assert on the
    request-parsing behaviour of the route layer in isolation."""

    def __init__(self):
        self.start_calls = []
        self.chat_calls = []

    def start(self, message=None):
        self.start_calls.append(message)
        return "fake-thread-id", {"received": message}

    def chat(self, thread_id, message):
        self.chat_calls.append((thread_id, message))
        return {"threadId": thread_id, "received": message}

    def get_state(self, thread_id):
        return {"threadId": thread_id, "values": {}}


@pytest.fixture
def fake_agents():
    return {"analyst": FakeWorkflow(), "researcher": FakeWorkflow(), "coder": FakeWorkflow()}


@pytest.fixture
def client(fake_agents, monkeypatch):
    # Both routers keep their own WorkflowOrchestrator instance; patch both
    # so /workflow and /stream behave identically in these tests.
    monkeypatch.setattr(workflow_routes.workflow_orchestrator, "agents", fake_agents)
    monkeypatch.setattr(stream_routes.workflow_orchestrator, "agents", fake_agents)
    return TestClient(main.app)


class TestHealth:
    def test_health_endpoint_returns_ok(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "ok"
        assert body["uptime_seconds"] >= 0


@pytest.mark.parametrize("prefix", ["/workflow", "/stream"])
class TestListWorkflows:
    def test_list_workflows(self, client, prefix):
        response = client.get(prefix)
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "success"
        assert set(body["workflows"]) == {"analyst", "researcher", "coder"}


@pytest.mark.parametrize("prefix", ["/workflow", "/stream"])
class TestCreateWorkflow:
    def test_create_with_valid_message_returns_200_and_envelope(self, client, prefix, fake_agents):
        payload = {"content": "Let's build something", "type": "human", "role": "user"}
        response = client.post(f"{prefix}/analyst", data={"message": json.dumps(payload)})

        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "success"
        assert body["threadId"] == "fake-thread-id"
        assert fake_agents["analyst"].start_calls == [payload]

    def test_create_with_no_message_or_file_starts_with_no_args(self, client, prefix, fake_agents):
        response = client.post(f"{prefix}/analyst")

        assert response.status_code == 200
        assert fake_agents["analyst"].start_calls == [None]

    def test_create_with_unknown_workflow_returns_404_not_200(self, client, prefix):
        # Regression test: the route used to catch HTTPException itself and
        # return it inside a 200 OK body (`{"error": ..., "status_code": 404}`),
        # so callers checking response.status_code could never detect this.
        response = client.post(f"{prefix}/not-a-real-workflow")

        assert response.status_code == 404
        body = response.json()
        assert body["status"] == "error"
        assert body["detail"] == "Workflow not found"

    def test_create_with_invalid_json_message_returns_400(self, client, prefix):
        response = client.post(f"{prefix}/analyst", data={"message": "{not valid json"})

        assert response.status_code == 400
        assert response.json()["status"] == "error"

    def test_create_with_message_and_file_merges_into_a_single_call(self, client, prefix, fake_agents):
        # Regression test: message + file used to trigger *two* separate
        # start() calls (a second thread that discarded the text message and
        # kept only the file). Now both are merged into one message dict and
        # start() is called exactly once.
        payload = {"content": "here's my file", "type": "human", "role": "user"}
        response = client.post(
            f"{prefix}/analyst",
            data={"message": json.dumps(payload)},
            files={"file": ("notes.txt", b"hello world", "text/plain")},
        )

        assert response.status_code == 200
        workflow = fake_agents["analyst"]
        assert len(workflow.start_calls) == 1
        received = workflow.start_calls[0]
        assert received["content"] == "here's my file"
        assert "file" in received and received["file"]  # base64 payload present


@pytest.mark.parametrize("prefix", ["/workflow", "/stream"])
class TestChatWorkflow:
    def test_chat_with_valid_message_returns_200(self, client, prefix, fake_agents):
        payload = {"content": "continue", "type": "human", "role": "user"}
        response = client.post(f"{prefix}/analyst/thread-1", data={"message": json.dumps(payload)})

        assert response.status_code == 200
        assert fake_agents["analyst"].chat_calls == [("thread-1", payload)]

    def test_chat_with_empty_message_returns_400(self, client, prefix):
        response = client.post(f"{prefix}/analyst/thread-1", data={"message": ""})

        assert response.status_code == 400
        assert response.json()["detail"] == "Message is required"

    def test_chat_with_missing_message_field_returns_422(self, client, prefix):
        # `message` is a required Form field; omitting it entirely (as
        # opposed to sending an empty string) is a request-validation error,
        # not our own "Message is required" check -- confirm it still comes
        # back with the same consistent JSON envelope and a serializable body.
        response = client.post(f"{prefix}/analyst/thread-1")

        assert response.status_code == 422
        body = response.json()
        assert body["status"] == "error"
        assert isinstance(body["detail"], list)

    def test_chat_with_unknown_workflow_returns_404(self, client, prefix):
        response = client.post(
            f"{prefix}/not-a-real-workflow/thread-1", data={"message": json.dumps({"content": "hi"})}
        )

        assert response.status_code == 404


@pytest.mark.parametrize("prefix", ["/workflow", "/stream"])
class TestGetWorkflowState:
    def test_get_state_returns_200(self, client, prefix):
        response = client.get(f"{prefix}/analyst/thread-1")
        assert response.status_code == 200
        assert response.json()["status"] == "success"

    def test_get_state_unknown_workflow_returns_404(self, client, prefix):
        response = client.get(f"{prefix}/not-a-real-workflow/thread-1")
        assert response.status_code == 404
        assert response.json()["status"] == "error"
