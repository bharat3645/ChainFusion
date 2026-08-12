"""Test configuration.

Several modules read API keys from the environment *at import time*
(agents/constants/ai_models.py builds a ChatOpenAI client, agents/constants/cdp.py
configures the CDP SDK, agents/tools/search_tools.py builds a Tavily client), so
these dummy values must be set before anything under `agents`/`routes`/`main` is
imported anywhere in the test session. Doing it here -- at conftest.py module
scope, rather than inside a fixture -- guarantees that, since pytest always
imports conftest.py before collecting the test modules in its directory.

No real network calls are made in this suite: HTTP-level tests monkeypatch the
workflow orchestrator's registered workflows with in-memory fakes, so these
values only need to be *present and well-formed enough not to error*, never
valid.
"""
import os

os.environ.setdefault("OPENAI_API_KEY", "sk-test-dummy-key-for-unit-tests")
os.environ.setdefault("TAVILY_API_KEY", "tvly-test-dummy-key")
os.environ.setdefault("CDP_API_KEY_NAME", "test-cdp-key-name")
os.environ.setdefault("CDP_API_KEY_PRIVATE_KEY", "test-cdp-private-key")
os.environ.setdefault("REPLICATE_API_TOKEN", "r8_test-dummy-token")
