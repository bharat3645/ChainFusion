// The base URL of the ChainFusion FastAPI backend (see Backend/).
// Set NEXT_PUBLIC_FASTAPI_URL in .env.local to point at your own deployment;
// defaults to the local dev server started with `python main.py` in Backend/.
export const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";
