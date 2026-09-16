"""
Task service: all task CRUD operations with ownership enforcement.
"""
import logging
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pymongo.database import Database

from app.models.task import build_task, safe_task, VALID_STATUSES
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate

logger = logging.getLogger(__name__)


def _get_task_or_404(db: Database, task_id: str) -> dict:
    """Fetch a task by ID or raise 404."""
    try:
        oid = ObjectId(task_id)
    except (InvalidId, Exception):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid task ID format: '{task_id}'.",
        )
    task = db.tasks.find_one({"_id": oid})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task '{task_id}' not found.",
        )
    return task


def _enforce_ownership(task: dict, user_id: str) -> None:
    """Raise 403 if the task does not belong to user_id."""
    if str(task["user_id"]) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this task.",
        )


def list_tasks(
    db: Database,
    user_id: str,
    status_filter: Optional[str] = None,
) -> list[dict]:
    """Return all tasks for user_id, sorted by created_at descending."""
    query: dict = {"user_id": user_id}
    if status_filter:
        if status_filter not in VALID_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status filter '{status_filter}'. Must be one of: {', '.join(sorted(VALID_STATUSES))}.",
            )
        query["status"] = status_filter

    tasks = list(db.tasks.find(query).sort("created_at", -1))
    return [safe_task(t) for t in tasks]


def create_task(db: Database, user_id: str, data: TaskCreate) -> dict:
    """Create and return a new task."""
    doc = build_task(
        title=data.title,
        user_id=user_id,
        description=data.description,
        due_date=data.due_date,
    )
    result = db.tasks.insert_one(doc)
    doc["_id"] = result.inserted_id
    logger.info("Task created [user=%s, task=%s]", user_id, str(result.inserted_id))
    return safe_task(doc)


def update_task(db: Database, user_id: str, task_id: str, data: TaskUpdate) -> dict:
    """Update task title and/or description. At least one field required."""
    if data.title is None and data.description is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="At least one of 'title' or 'description' must be provided.",
        )

    task = _get_task_or_404(db, task_id)
    _enforce_ownership(task, user_id)

    updates: dict = {}
    if data.title is not None:
        updates["title"] = data.title
    if data.description is not None:
        updates["description"] = data.description

    db.tasks.update_one({"_id": task["_id"]}, {"$set": updates})
    updated = db.tasks.find_one({"_id": task["_id"]})
    logger.info("Task updated [user=%s, task=%s]", user_id, task_id)
    return safe_task(updated)


def update_task_status(
    db: Database, user_id: str, task_id: str, data: TaskStatusUpdate
) -> dict:
    """Update a task's status. Ownership enforced."""
    task = _get_task_or_404(db, task_id)
    _enforce_ownership(task, user_id)

    db.tasks.update_one({"_id": task["_id"]}, {"$set": {"status": data.status}})
    updated = db.tasks.find_one({"_id": task["_id"]})
    logger.info("Task status updated [user=%s, task=%s, status=%s]", user_id, task_id, data.status)
    return safe_task(updated)


def delete_task(db: Database, user_id: str, task_id: str) -> None:
    """Delete a task. Ownership enforced. Returns None (204)."""
    task = _get_task_or_404(db, task_id)
    _enforce_ownership(task, user_id)

    db.tasks.delete_one({"_id": task["_id"]})
    logger.info("Task deleted [user=%s, task=%s]", user_id, task_id)
