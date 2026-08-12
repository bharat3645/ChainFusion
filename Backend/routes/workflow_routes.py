from typing import Union

from fastapi import APIRouter, File, Form, HTTPException, Path, UploadFile

from agents.orchestrator import WorkflowOrchestrator
from routes._common import merge_file, parse_message

# Create an API router specifically for workflow-related routes
router = APIRouter()
# Initialize the WorkflowOrchestrator instance
workflow_orchestrator = WorkflowOrchestrator()


@router.post("/{workflowName}")
async def create_workflow(
    workflowName: str = Path(..., description="Name of the workflow"),
    message: Union[str, None] = Form(
        None, description="Stringified JSON message from the request body (optional)"),
    file: Union[UploadFile, None] = File(
        None, description="Optional uploaded file"),
):
    """
    Initiates a new workflow based on the provided workflow name.
    Returns a unique threadId and the initial state of the workflow.
    """
    message_dict = parse_message(message)
    message_dict = await merge_file(message_dict, file)

    threadId, state = workflow_orchestrator.start(workflowName, message_dict)
    return {"status": "success", "state": state, "threadId": threadId}


@router.get("/{workflowName}/{threadId}")
async def get_workflow_state(
    workflowName: str = Path(..., description="Name of the workflow"),
    threadId: str = Path(..., description="Thread ID of the workflow"),
):
    """
    Retrieves the current state of an active workflow.
    """
    state = workflow_orchestrator.get_state(workflowName, threadId)
    return {"status": "success", "state": state}


@router.post("/{workflowName}/{threadId}")
async def chat_workflow(
    workflowName: str = Path(..., description="Name of the workflow"),
    threadId: str = Path(..., description="Thread ID of the workflow"),
    message: str = Form(..., description="Stringified JSON message"),
    file: Union[UploadFile, None] = File(
        None, description="Optional uploaded file"),
):
    """
    Sends additional input to an active workflow.
    Accepts a JSON message and an optional file to continue the workflow session.
    """
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    message_dict = parse_message(message)
    message_dict = await merge_file(message_dict, file)

    state = workflow_orchestrator.chat(workflowName, threadId, message_dict)
    return {"status": "success", "state": state}


@router.get("")
async def list_workflows():
    """
    Lists all available workflows.
    """
    return {"status": "success", "workflows": workflow_orchestrator.getAll()}
