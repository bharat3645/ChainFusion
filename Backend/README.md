# ChainFusion Backend

FastAPI backend that powers the ChainFusion AI agents (Business Architect, Research Analyst, Smart Contract Developer) using LangChain/LangGraph.

## Setup

```sh
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Environment variables

Copy the example env files and fill in your own keys:

```sh
cp .env.example .env
cp api.env.example api.env
```

- `.env` — `OPENAI_API_KEY`, `TAVILY_API_KEY`, `REPLICATE_API_TOKEN`
- `api.env` — `CDP_API_KEY_NAME`, `CDP_API_KEY_PRIVATE_KEY` (Coinbase Developer Platform, used to deploy tokens from the Smart Contract Developer agent)

## Run

```sh
python main.py
```

or with uvicorn directly:

```sh
uvicorn main:app --reload --port 8000
```

## Docker

```sh
docker-compose up --build
```

## API

Interactive docs (Swagger UI) are served at `/docs` once the app is running (`/redoc` for ReDoc), generated from the route definitions below.

- `GET /health` — liveness/readiness probe (used by the Docker healthcheck)
- `POST /workflow/{workflowName}` — start a workflow (`analyst`, `researcher`, or `coder`)
- `GET /workflow/{workflowName}/{threadId}` — get the current state of a workflow thread
- `POST /workflow/{workflowName}/{threadId}` — send a message/file to continue a workflow thread
- `GET /workflow` — list available workflows

The `/stream` routes mirror the `/workflow` routes (see `routes/stream_routes.py`).

All error responses use a consistent envelope — `{"status": "error", "detail": ...}` — with the real HTTP status code (400/404/422/500) set to match, so callers can rely on the status code rather than having to inspect the body.

## Tests

```sh
pip install -r requirements.txt -r requirements-dev.txt
pytest
```

The suite (`tests/`) covers the orchestrator's routing/error behavior and the HTTP layer of `/workflow` and `/stream`, using in-memory fakes for the actual agent workflows so it runs in seconds with no API keys or network access required. It also includes regression tests for a bug where starting or continuing any workflow with an initial message raised `TypeError: the JSON object must be str, bytes or bytearray, not dict` (the message was JSON-decoded once in the route layer, then decoded again — on an already-decoded dict — inside each workflow's `start()`/`chat()`).

This also runs in CI on every push/PR — see `.github/workflows/ci.yml` at the repo root (alongside a Hardhat/Next.js job for the frontend).
