"""
Task routes: all protected by JWT middleware dependency.
Routes → Services → Database (clean separation of concerns).
"""
from typing import Optional
from fastapi import APIRouter, Depends, Response, status
from pymongo.database import Database

from app.config.database import get_db
from app.middleware.auth import get_current_user_id
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate, TaskResponse
from app.services import task_service

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get(
    "",
    response_model=list[TaskResponse],
    summary="List Tasks",
    description="Get all tasks for the authenticated user, sorted by created_at descending. Optionally filter by status.",
)
def list_tasks(
    status: Optional[str] = None,
    user_id: str = Depends(get_current_user_id),
    db: Database = Depends(get_db),
) -> list[TaskResponse]:
    return task_service.list_tasks(db, user_id, status_filter=status)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=201,
    summary="Create Task",
    description="Create a new task. Status defaults to 'Planned'. Title is required.",
)
def create_task(
    body: TaskCreate,
    user_id: str = Depends(get_current_user_id),
    db: Database = Depends(get_db),
) -> TaskResponse:
    return task_service.create_task(db, user_id, body)


@router.patch(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update Task",
    description="Update a task's title and/or description. At least one field required. Ownership enforced.",
)
def update_task(
    task_id: str,
    body: TaskUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Database = Depends(get_db),
) -> TaskResponse:
    return task_service.update_task(db, user_id, task_id, body)


@router.patch(
    "/{task_id}/status",
    response_model=TaskResponse,
    summary="Update Task Status",
    description="Update a task's status. Must be one of: Planned, In Progress, Complete. Ownership enforced.",
)
def update_task_status(
    task_id: str,
    body: TaskStatusUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Database = Depends(get_db),
) -> TaskResponse:
    return task_service.update_task_status(db, user_id, task_id, body)


@router.delete(
    "/{task_id}",
    status_code=204,
    summary="Delete Task",
    description="Delete a task. Ownership enforced. Returns 204 No Content.",
)
def delete_task(
    task_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Database = Depends(get_db),
) -> Response:
    task_service.delete_task(db, user_id, task_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
