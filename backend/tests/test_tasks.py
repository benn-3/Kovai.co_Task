"""
Tests for task_service: CRUD operations, ownership enforcement, validation.
"""
import pytest
from unittest.mock import MagicMock, patch
from bson import ObjectId
from fastapi import HTTPException

from app.services.task_service import (
    list_tasks, create_task, update_task, update_task_status, delete_task
)
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate


def make_task(user_id: str, status: str = "Planned", title: str = "Test Task"):
    oid = ObjectId()
    from datetime import datetime, timezone
    return {
        "_id": oid,
        "title": title,
        "description": "Description",
        "status": status,
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc),
        "due_date": None,
    }


# ── List Tasks ─────────────────────────────────────────────────────────────────

def test_list_tasks_returns_user_tasks(mock_db, sample_user_id):
    tasks = [make_task(sample_user_id), make_task(sample_user_id)]
    mock_db.tasks.find.return_value.sort.return_value = tasks

    result = list_tasks(mock_db, sample_user_id)
    assert len(result) == 2


def test_list_tasks_empty(mock_db, sample_user_id):
    mock_db.tasks.find.return_value.sort.return_value = []
    result = list_tasks(mock_db, sample_user_id)
    assert result == []


def test_list_tasks_invalid_status_filter(mock_db, sample_user_id):
    with pytest.raises(HTTPException) as exc_info:
        list_tasks(mock_db, sample_user_id, status_filter="Invalid")
    assert exc_info.value.status_code == 422


# ── Create Task ────────────────────────────────────────────────────────────────

def test_create_task_success(mock_db, sample_user_id):
    inserted_id = ObjectId()
    mock_db.tasks.insert_one.return_value = MagicMock(inserted_id=inserted_id)

    data = TaskCreate(title="New Task", description="Desc")
    result = create_task(mock_db, sample_user_id, data)
    assert result["title"] == "New Task"
    assert result["status"] == "Planned"
    assert result["user_id"] == sample_user_id


def test_create_task_missing_title():
    with pytest.raises(Exception):
        TaskCreate(title="", description="Desc")


def test_create_task_whitespace_title():
    with pytest.raises(Exception):
        TaskCreate(title="   ", description="Desc")


# ── Update Task ────────────────────────────────────────────────────────────────

def test_update_task_success(mock_db, sample_user_id, sample_task):
    sample_task["user_id"] = sample_user_id
    mock_db.tasks.find_one.side_effect = [sample_task, {**sample_task, "title": "Updated"}]
    mock_db.tasks.update_one.return_value = MagicMock()

    data = TaskUpdate(title="Updated")
    result = update_task(mock_db, sample_user_id, str(sample_task["_id"]), data)
    assert result["title"] == "Updated"


def test_update_task_no_fields(mock_db, sample_user_id, sample_task):
    sample_task["user_id"] = sample_user_id
    mock_db.tasks.find_one.return_value = sample_task

    data = TaskUpdate()
    with pytest.raises(HTTPException) as exc_info:
        update_task(mock_db, sample_user_id, str(sample_task["_id"]), data)
    assert exc_info.value.status_code == 422


def test_update_task_wrong_owner(mock_db, sample_user_id, sample_task):
    sample_task["user_id"] = str(ObjectId())  # different owner
    mock_db.tasks.find_one.return_value = sample_task

    data = TaskUpdate(title="Hacked")
    with pytest.raises(HTTPException) as exc_info:
        update_task(mock_db, sample_user_id, str(sample_task["_id"]), data)
    assert exc_info.value.status_code == 403


def test_update_task_not_found(mock_db, sample_user_id):
    mock_db.tasks.find_one.return_value = None

    data = TaskUpdate(title="Updated")
    with pytest.raises(HTTPException) as exc_info:
        update_task(mock_db, sample_user_id, str(ObjectId()), data)
    assert exc_info.value.status_code == 404


def test_update_task_invalid_id(mock_db, sample_user_id):
    data = TaskUpdate(title="X")
    with pytest.raises(HTTPException) as exc_info:
        update_task(mock_db, sample_user_id, "not-an-object-id", data)
    assert exc_info.value.status_code == 422


# ── Update Status ──────────────────────────────────────────────────────────────

def test_update_status_valid(mock_db, sample_user_id, sample_task):
    sample_task["user_id"] = sample_user_id
    updated = {**sample_task, "status": "In Progress"}
    mock_db.tasks.find_one.side_effect = [sample_task, updated]
    mock_db.tasks.update_one.return_value = MagicMock()

    data = TaskStatusUpdate(status="In Progress")
    result = update_task_status(mock_db, sample_user_id, str(sample_task["_id"]), data)
    assert result["status"] == "In Progress"


def test_update_status_invalid():
    with pytest.raises(Exception):
        TaskStatusUpdate(status="Done")


def test_update_status_wrong_owner(mock_db, sample_user_id, sample_task):
    sample_task["user_id"] = str(ObjectId())
    mock_db.tasks.find_one.return_value = sample_task

    data = TaskStatusUpdate(status="Complete")
    with pytest.raises(HTTPException) as exc_info:
        update_task_status(mock_db, sample_user_id, str(sample_task["_id"]), data)
    assert exc_info.value.status_code == 403


# ── Delete Task ────────────────────────────────────────────────────────────────

def test_delete_task_success(mock_db, sample_user_id, sample_task):
    sample_task["user_id"] = sample_user_id
    mock_db.tasks.find_one.return_value = sample_task
    mock_db.tasks.delete_one.return_value = MagicMock()

    # Should not raise
    delete_task(mock_db, sample_user_id, str(sample_task["_id"]))


def test_delete_task_wrong_owner(mock_db, sample_user_id, sample_task):
    sample_task["user_id"] = str(ObjectId())
    mock_db.tasks.find_one.return_value = sample_task

    with pytest.raises(HTTPException) as exc_info:
        delete_task(mock_db, sample_user_id, str(sample_task["_id"]))
    assert exc_info.value.status_code == 403


def test_delete_task_not_found(mock_db, sample_user_id):
    mock_db.tasks.find_one.return_value = None
    with pytest.raises(HTTPException) as exc_info:
        delete_task(mock_db, sample_user_id, str(ObjectId()))
    assert exc_info.value.status_code == 404
