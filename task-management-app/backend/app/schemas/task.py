"""
Pydantic schemas for task request/response validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator

VALID_STATUSES = {"Planned", "In Progress", "Complete"}


# ── Request Schemas ────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Title is required and cannot be empty.")
        return v.strip()

    @field_validator("description")
    @classmethod
    def description_strip(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            return v if v else None
        return v


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Title cannot be empty.")
        return v.strip() if v else v

    @field_validator("description")
    @classmethod
    def description_strip(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            return v if v else None
        return v


class TaskStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def valid_status(cls, v: str) -> str:
        if v not in VALID_STATUSES:
            raise ValueError(
                f"Invalid status '{v}'. Must be one of: {', '.join(sorted(VALID_STATUSES))}."
            )
        return v


# ── Response Schemas ───────────────────────────────────────────────────────────

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: str
    user_id: str
    created_at: Optional[str] = None
    due_date: Optional[str] = None
