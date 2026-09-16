"""
Task document model helpers and field constants.
Defines the shape of a task document in the 'tasks' MongoDB collection.
"""
from datetime import datetime, timezone
from typing import Optional

VALID_STATUSES = {"Planned", "In Progress", "Complete"}


def build_task(
    title: str,
    user_id: str,
    description: Optional[str] = None,
    due_date: Optional[datetime] = None,
) -> dict:
    """Build a new task document."""
    return {
        "title": title.strip(),
        "description": description.strip() if description else None,
        "status": "Planned",
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc),
        "due_date": due_date,
    }


def safe_task(task: dict) -> dict:
    """Return a task dict safe for API responses (_id as str id)."""
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description"),
        "status": task["status"],
        "user_id": str(task["user_id"]),
        "created_at": task["created_at"].isoformat() if task.get("created_at") else None,
        "due_date": task["due_date"].isoformat() if task.get("due_date") else None,
    }
