"""Shared helpers for the /workflow and /stream route modules.

Both route modules expose the same request shape (a stringified-JSON `message`
form field plus an optional file upload) against their own `WorkflowOrchestrator`
instance, so the request-parsing logic lives here once instead of being
copy-pasted (and having to be bugfixed twice, as happened before).
"""
import base64
import json
from typing import Optional

from fastapi import HTTPException, UploadFile


def parse_message(message: Optional[str]) -> Optional[dict]:
    """Parses the stringified JSON `message` form field into a dict.

    Raises a 400 HTTPException (rather than letting a raw ValueError/TypeError
    bubble up as an opaque 500) if it isn't valid JSON or isn't a JSON object.
    """
    if not message:
        return None
    try:
        parsed = json.loads(message)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in 'message'")
    if not isinstance(parsed, dict):
        raise HTTPException(status_code=400, detail="'message' must be a JSON object")
    return parsed


async def merge_file(message_dict: Optional[dict], file: Optional[UploadFile]) -> Optional[dict]:
    """Base64-encodes an uploaded file and merges it into the message dict.

    Previously, a message + file combination triggered a *second* call to
    `workflow_orchestrator.start(...)`, which created an entirely new thread
    (discarding the text message and the first thread ID) instead of
    attaching the file to the same message. This merges them into one dict
    so the workflow is only ever started/continued once per request.
    """
    if file is None:
        return message_dict
    file_content = await file.read()
    encoded_file = base64.b64encode(file_content).decode("utf-8")
    message_dict = dict(message_dict) if message_dict else {}
    message_dict["file"] = encoded_file
    return message_dict
