"""
Pytest configuration and shared fixtures for the test suite.
"""
import os
import pytest
from unittest.mock import MagicMock, patch
from bson import ObjectId
from datetime import datetime, timezone

# Set test environment variables before importing app modules
os.environ.setdefault("MONGODB_URI", "mongodb://localhost:27017/testdb")
os.environ.setdefault("JWT_SECRET", "test-secret-key-for-testing-only")
os.environ.setdefault("JWT_EXPIRY_HOURS", "24")
os.environ.setdefault("GOOGLE_CLIENT_ID", "test-client-id.apps.googleusercontent.com")
os.environ.setdefault("ALLOWED_ORIGIN", "http://localhost:5173")


@pytest.fixture
def mock_db():
    """Return a mock MongoDB database object."""
    return MagicMock()


@pytest.fixture
def sample_user_id():
    return str(ObjectId())


@pytest.fixture
def sample_local_user(sample_user_id):
    oid = ObjectId(sample_user_id)
    return {
        "_id": oid,
        "email": "test@example.com",
        "auth_provider": "local",
        "password_hash": "$2b$12$placeholderhashedpassword",
        "mobile_number": "9876543210",
        "name": None,
        "picture": None,
        "created_at": datetime.now(timezone.utc),
    }


@pytest.fixture
def sample_google_user(sample_user_id):
    oid = ObjectId(sample_user_id)
    return {
        "_id": oid,
        "email": "google@example.com",
        "auth_provider": "google",
        "google_sub": "google-sub-12345",
        "password_hash": None,
        "mobile_number": None,
        "name": "Google User",
        "picture": "https://example.com/photo.jpg",
        "created_at": datetime.now(timezone.utc),
    }


@pytest.fixture
def sample_task(sample_user_id):
    oid = ObjectId()
    return {
        "_id": oid,
        "title": "Test Task",
        "description": "A test description",
        "status": "Planned",
        "user_id": sample_user_id,
        "created_at": datetime.now(timezone.utc),
        "due_date": None,
    }
