# ChainFusion

**Bridge your Web2 app to Web3 with AI agents that do the heavy lifting.**

[![CI](https://github.com/bharat3645/ChainFusion/actions/workflows/ci.yml/badge.svg)](https://github.com/bharat3645/ChainFusion/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](Backend/requirements.txt)
[![Next.js 14](https://img.shields.io/badge/next.js-14-black.svg)](Frontend/packages/nextjs/package.json)
[![Tests: 38 passing](https://img.shields.io/badge/tests-38%20passing-brightgreen.svg)](Backend/tests)

ChainFusion pairs a conversational multi-agent backend with a Next.js/Hardhat frontend so a founder or developer can go from "I have a Web2 app" to "I have an architecture, research, and a deployed smart contract" without becoming a blockchain expert first.

---

## Table of Contents

- [Why ChainFusion](#why-chainfusion)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Testing & CI](#testing--ci)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Why ChainFusion

Taking a traditional Web2 application into the decentralized Web3 ecosystem is a complex, resource-intensive process. Teams run into the same walls every time:

- **Lack of blockchain expertise** — moving over requires specialized knowledge of smart contracts, decentralized storage, and tokenization.
- **Time and cost constraints** — manual system architecture planning and deployment can take months.
- **Uncertainty in technology choices** — the blockchain landscape moves fast, and staying current with secure, scalable patterns is a full-time job.
- **Deployment complexity** — standing up nodes, deploying contracts, and wiring up wallet integrations demands advanced technical skill.

ChainFusion tackles this with three purpose-built AI agents that automate the planning, research, and implementation work, backed by a FastAPI service and a Next.js/Hardhat frontend that turns the conversation into a real, deployable system.

## Features

- **Three specialized AI agents**, each a dedicated LangGraph workflow:
  - **Business Architect (`analyst`)** — turns a description of your Web2 app into a system architecture and a Mermaid diagram.
  - **Research Analyst (`researcher`)** — gathers and analyzes blockchain trends, security risks, and best practices relevant to your migration.
  - **Smart Contract Developer (`coder`)** — writes, tests, and deploys smart contracts (via the Coinbase Developer Platform).
- **A working chat API.** `POST /workflow/{name}` and `POST /workflow/{name}/{threadId}` start and continue a conversation with any of the three agents, including file uploads alongside a text message in a single call.
- **Real HTTP semantics.** Every error — a bad workflow name, a malformed request, an internal failure — comes back with the correct HTTP status code (400/404/422/500) and a consistent `{"status": "error", "detail": ...}` JSON envelope, instead of a `200 OK` hiding a failure in the body.
- **A pytest suite (38 tests)** covering orchestrator routing, HTTP status codes, and dedicated regression coverage for the two bugs above, running in ~10 seconds with no API keys or network access required.
- **CI on every push/PR** — a backend job (install, byte-compile, pytest) and a frontend job (Yarn install, Hardhat compile + test, Next.js type-check, lint).
- **Operational basics done right** — a `GET /health` liveness probe wired into a Docker healthcheck, and OpenAPI metadata so `/docs` is actually useful.
- **Wallet-native frontend** — RainbowKit + wagmi + viem wallet connection, a Hardhat contract debugger, and a block explorer, all built on Next.js 14.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14, React 18, TypeScript, TailwindCSS, DaisyUI, RainbowKit, wagmi, viem |
| Backend | Python 3.12, FastAPI, Uvicorn |
| AI / Agents | LangChain, LangGraph, OpenAI, Tavily (search), Replicate (image generation) |
| Blockchain | Hardhat, Solidity, OpenZeppelin, Coinbase Developer Platform (CDP) SDK |
| Testing | pytest + httpx (backend), Hardhat/Mocha/Chai (contracts), Next.js type-check |
| CI/CD | GitHub Actions |
| Infra | Docker / Docker Compose |

## Architecture

```
                              ┌───────────────────────────┐
                              │        Frontend           │
                              │  Next.js 14 + RainbowKit   │
                              │  (Frontend/packages/nextjs)│
                              └──────────────┬─────────────┘
                                             │ HTTPS (JSON / multipart)
                                             ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          FastAPI backend (Backend/)                       │
│                                                                             │
│  main.py                                                                   │
│   ├─ global exception handlers → {"status":"error","detail":...} + real   │
│   │   HTTP status codes (400/404/422/500)                                 │
│   ├─ GET  /health                                                         │
│   ├─ /workflow/*  ─┐                                                      │
│   └─ /stream/*    ─┴─► routes/_common.py (shared request parsing)         │
│                          │                                                 │
│                          ▼                                                 │
│                agents/orchestrator.py (WorkflowOrchestrator)               │
│                          │                                                 │
│         ┌────────────────┼────────────────────┐                          │
│         ▼                ▼                     ▼                          │
│   analyst workflow  researcher workflow   coder workflow                   │
│   (LangGraph)        (LangGraph)          (LangGraph)                     │
│   Business           Research Analyst     Smart Contract Developer         │
│   Architect          (Tavily search)      (CDP SDK → deploys contracts)   │
└───────────────────────────────────────────────────────────────────────────┘
```

Each agent is an independent LangGraph state machine with its own nodes (`agents/workflows/{analyst,researcher,coder}/`), checkpointed per conversation thread so a chat can pause for approval and resume later. `routes/_common.py` centralizes the request parsing that both `/workflow` and `/stream` share, and `main.py` registers the exception handlers that give every route consistent, correct HTTP semantics.

## Project Structure

```
ChainFusion/
├── Backend/                     # FastAPI backend
│   ├── agents/
│   │   ├── orchestrator.py      # Routes a workflow name to its agent
│   │   ├── workflows/
│   │   │   ├── analyst/         # Business Architect agent
│   │   │   ├── researcher/      # Research Analyst agent
│   │   │   └── coder/           # Smart Contract Developer agent
│   │   ├── tools/                # Search, image generation, etc.
│   │   └── constants/            # Model + CDP configuration
│   ├── routes/
│   │   ├── workflow_routes.py
│   │   ├── stream_routes.py
│   │   └── _common.py            # Shared request-parsing logic
│   ├── tests/                    # pytest suite (38 tests)
│   ├── main.py                   # App entrypoint, error handlers, /health
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── pytest.ini
│   ├── Dockerfile
│   └── docker-compose.yml
├── Frontend/                     # Yarn workspace (Next.js + Hardhat)
│   └── packages/
│       ├── nextjs/               # Next.js web app
│       └── hardhat/              # Solidity contracts + tests
├── .github/workflows/ci.yml      # Backend + frontend CI
└── LICENSE
```

## Getting Started

### Prerequisites

- [Python](https://www.python.org/) 3.12+
- [Node.js](https://nodejs.org/) ≥ 18.18 and [Yarn](https://yarnpkg.com/) (v3, via Corepack)
- API keys: [OpenAI](https://platform.openai.com/api-keys), [Tavily](https://tavily.com), [Replicate](https://replicate.com/account/api-tokens), and [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) (for on-chain deployment via the Smart Contract Developer agent)
- (Optional) [Docker](https://www.docker.com/) to run the backend in a container

### Clone the repository

```sh
git clone https://github.com/bharat3645/ChainFusion.git
cd ChainFusion
```

### Backend setup

```sh
cd Backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env          # OPENAI_API_KEY, TAVILY_API_KEY, REPLICATE_API_TOKEN
cp api.env.example api.env    # CDP_API_KEY_NAME, CDP_API_KEY_PRIVATE_KEY

python main.py                # or: uvicorn main:app --reload --port 8000
```

The API is now live at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

#### Run the backend with Docker instead

```sh
cd Backend
docker-compose up --build
```

### Frontend setup

```sh
cd Frontend
yarn install
yarn chain      # local Hardhat node, in its own terminal
yarn deploy     # deploy contracts to the local chain
yarn start      # Next.js dev server
```

The app is now live at `http://localhost:3000`.

## Usage

1. Start the backend (`Backend/`) and the frontend (`Frontend/`) as above.
2. Open `http://localhost:3000` and connect a wallet.
3. Pick an agent — **Business Architect**, **Research Analyst**, or **Smart Contract Developer** — and describe your Web2 app or migration goal.
4. The agent responds with architecture guidance, research findings, or generated/deployed contract code, depending on which one you're talking to. Conversations are stateful: each has a `threadId` you can keep sending follow-up messages (and files) to.

You can also talk to an agent directly over HTTP without the frontend — see [API Reference](#api-reference).

## API Reference

Full interactive docs (Swagger UI) are served at `/docs` once the backend is running (`/redoc` for ReDoc).

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Liveness/readiness probe (uptime in seconds) |
| `GET` | `/workflow` | List available workflows (`analyst`, `researcher`, `coder`) |
| `POST` | `/workflow/{workflowName}` | Start a new conversation with an agent (message and/or file) |
| `GET` | `/workflow/{workflowName}/{threadId}` | Get the current state of a conversation thread |
| `POST` | `/workflow/{workflowName}/{threadId}` | Continue a conversation thread with a new message and/or file |

The `/stream/*` routes mirror `/workflow/*` (reserved for a future token-by-token streaming implementation).

Every error response — 400, 404, 422, or 500 — uses the same envelope:

```json
{ "status": "error", "detail": "..." }
```

with the real HTTP status code set to match, so callers can trust `response.status` instead of having to inspect the body.

## Testing & CI

```sh
# Backend
cd Backend
pip install -r requirements.txt -r requirements-dev.txt
pytest -v

# Frontend contracts
cd Frontend
yarn hardhat:test
```

- **`Backend/tests/`** — 38 pytest tests covering the workflow orchestrator's routing/error behavior and the HTTP layer of `/workflow` and `/stream`, using in-memory fakes for the agents so the whole suite runs in ~10 seconds with no API keys or network access required. Includes dedicated regression tests for a bug where starting or continuing any workflow with a message raised `TypeError: the JSON object must be str, bytes or bytearray, not dict` (the message was JSON-decoded once in the route layer, then decoded again — on an already-decoded dict — inside each workflow), and for a companion bug where sending a message and a file together triggered two separate `start()` calls, silently dropping the message and orphaning a second thread.
- **`Frontend/packages/hardhat/test/`** — Hardhat/Mocha/Chai contract tests.
- **`.github/workflows/ci.yml`** — runs both suites on every push/PR to `main`, plus a Next.js type-check and lint pass.

## Roadmap

- Token-by-token streaming for `/stream/*` (currently mirrors `/workflow/*`)
- Additional chain support beyond the current CDP-backed deployment flow
- Expanded test coverage for the Next.js frontend

## Contributing

Issues and pull requests are welcome — see [`Frontend/CONTRIBUTING.md`](Frontend/CONTRIBUTING.md) for guidelines. Please open an issue first to discuss significant changes before submitting a PR, and make sure `pytest` (backend) and `yarn hardhat:test` (contracts) pass before requesting review.

## License

This project is licensed under the [MIT License](./LICENSE).
