import logging
import time

from dotenv import load_dotenv

# Load environment variables from the .env file BEFORE importing anything that
# reads them at import time (e.g. agents/constants/ai_models.py constructs a
# ChatOpenAI client at module load, which needs OPENAI_API_KEY already set).
load_dotenv(override=True)

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
# `fastapi.HTTPException` (used everywhere else in the app) is a *subclass* of
# this. Registering the handler on the Starlette base class instead of the
# FastAPI subclass ensures it also catches exceptions FastAPI/Starlette raise
# internally as the base type -- most notably routing-level 404s for paths
# that don't match any route -- which a handler registered only for the
# subclass would silently miss (Starlette resolves handlers by walking the
# raised exception's actual MRO, and a subclass is not an ancestor of its
# parent).
from starlette.exceptions import HTTPException as StarletteHTTPException

from routes.workflow_routes import router as workflow_router
from routes.stream_routes import router as stream_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chainfusion")

tags_metadata = [
    {
        "name": "Workflow",
        "description": "Start, continue, and inspect the LangGraph agent workflows "
        "(`analyst`, `researcher`, `coder`). Responses are returned in a single "
        "JSON payload once the graph pauses (at an approval step) or finishes.",
    },
    {
        "name": "Stream",
        "description": "Mirrors the `Workflow` endpoints. Reserved for a future "
        "token-by-token streaming implementation; currently behaves identically "
        "to `Workflow`.",
    },
    {
        "name": "System",
        "description": "Operational endpoints (health checks, etc.) that are not "
        "part of the agent API surface.",
    },
]

# Initialize the FastAPI app
app = FastAPI(
    title="ChainFusion API",
    description=(
        "Backend for ChainFusion's multi-agent system: a Business Architect "
        "(analyst), Research Analyst (researcher), and Smart Contract Developer "
        "(coder) agent, each implemented as a LangGraph workflow."
    ),
    version="1.0.0",
    openapi_tags=tags_metadata,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Start time tracking
start_time = time.time()


# --- Centralized error handling -------------------------------------------------
#
# Individual route handlers used to catch HTTPException themselves and return it
# inside a 200 OK response body (e.g. `{"error": "...", "status_code": 404}`),
# which means callers checking the HTTP status code could never actually detect
# a failure. These handlers make error responses use the real HTTP status code
# while keeping a consistent, machine-readable JSON envelope.
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "error", "detail": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    # exc.errors() can contain non-JSON-serializable context (e.g. raw
    # exception objects in Pydantic v2's `ctx`); jsonable_encoder sanitizes it
    # the same way FastAPI's own default handler does.
    return JSONResponse(
        status_code=422,
        content={"status": "error", "detail": jsonable_encoder(exc.errors())},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    # Log the full traceback server-side, but never leak internals to the client.
    logger.exception("Unhandled exception while processing %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content={"status": "error", "detail": "Internal server error"},
    )


@app.get("/health", tags=["System"])
async def health_check():
    """Lightweight liveness/readiness probe (used by Docker/Compose/orchestrators)."""
    return {
        "status": "ok",
        "uptime_seconds": round(time.time() - start_time, 2),
    }


# Include workflow router
app.include_router(workflow_router, prefix="/workflow", tags=["Workflow"])
app.include_router(stream_router, prefix="/stream", tags=["Stream"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
