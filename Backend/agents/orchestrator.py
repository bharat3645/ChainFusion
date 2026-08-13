from typing import Optional, Type, Dict, Union
from fastapi import HTTPException
from agents.workflows.index import WorkflowInterface
from langgraph.checkpoint.memory import MemorySaver
from fastapi import HTTPException
from agents.workflows.analyst.index import AnalystWorkflow
from agents.workflows.researcher.index import ResearchWorkflow
from agents.workflows.coder.index import CoderWorkflow

class WorkflowOrchestrator:
    def __init__(self):
        self.checkpointer = MemorySaver()
        self.AnalystWorkflow = AnalystWorkflow(self.checkpointer)
        self.ResearcherWorkflow = ResearchWorkflow(self.checkpointer)
        self.CoderWorkflow = CoderWorkflow(self.checkpointer)
        # Mapping of workflows to initialization functions
        self.agents: Dict[str, Type[WorkflowInterface]] = {
            "analyst": self.AnalystWorkflow,
            "researcher": self.ResearcherWorkflow,
            "coder": self.CoderWorkflow
        }

    def start(self, workflow_name: str, message: Optional[Union[dict, str, None]] = None):
        """Starts a workflow by name if available, else raises an HTTPException."""
        try:
            if workflow_name in self.agents:
                if (message):
                    return self.agents[workflow_name].start(message)
                return self.agents[workflow_name].start()
            else:
                raise HTTPException(status_code=404, detail="Workflow not found")
        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=str(e))

    def chat(self, workflow_name: str, thread_id: str, message: dict):
        """Replies to an active workflow given a workflow name, thread ID, and message."""
        if workflow_name not in self.agents:
            raise HTTPException(status_code=404, detail="Workflow not found")

        return self.agents[workflow_name].chat(thread_id, message)

    def get_state(self, workflow_name: str, thread_id: str):
        """Retrieves the current state of an active workflow."""
        if workflow_name not in self.agents:
            raise HTTPException(status_code=404, detail="Workflow not found")
        return self.agents[workflow_name].get_state(thread_id)

    def getAll(self):
        """Returns the names of all available workflows."""
        return list(self.agents.keys())
