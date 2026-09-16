"""
Tests for user_service: register, login, Google user upsert, JWT creation.
"""
import pytest
from unittest.mock import MagicMock, patch, call
from bson import ObjectId
from fastapi import HTTPException

from app.services.user_service import register_user, login_user, get_or_create_google_user, create_jwt
from app.schemas.auth import RegisterRequest, LoginRequest


# ── JWT ────────────────────────────────────────────────────────────────────────

def test_create_jwt_contains_user_id():
    import jwt as pyjwt
    from app.core.config import settings
    user_id = str(ObjectId())
    token = create_jwt(user_id)
    payload = pyjwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
    assert payload["user_id"] == user_id


# ── Registration ───────────────────────────────────────────────────────────────

def test_register_success(mock_db, sample_local_user):
    mock_db.users.find_one.return_value = None  # no existing user
    inserted_id = ObjectId()
    mock_db.users.insert_one.return_value = MagicMock(inserted_id=inserted_id)

    data = RegisterRequest(
        email="new@example.com",
        password="Password1",
        confirm_password="Password1",
        mobile_number="9876543210",
    )
    result = register_user(mock_db, data)
    assert result.access_token
    assert result.user.email == "new@example.com"
    assert result.user.auth_provider == "local"


def test_register_duplicate_email(mock_db, sample_local_user):
    mock_db.users.find_one.return_value = sample_local_user

    data = RegisterRequest(
        email="test@example.com",
        password="Password1",
        confirm_password="Password1",
        mobile_number="9876543210",
    )
    with pytest.raises(HTTPException) as exc_info:
        register_user(mock_db, data)
    assert exc_info.value.status_code == 409


def test_register_password_too_short():
    with pytest.raises(Exception):
        RegisterRequest(
            email="user@example.com",
            password="abc1",
            confirm_password="abc1",
            mobile_number="9876543210",
        )


def test_register_password_no_letter():
    with pytest.raises(Exception):
        RegisterRequest(
            email="user@example.com",
            password="12345678",
            confirm_password="12345678",
            mobile_number="9876543210",
        )


def test_register_password_no_number():
    with pytest.raises(Exception):
        RegisterRequest(
            email="user@example.com",
            password="abcdefgh",
            confirm_password="abcdefgh",
            mobile_number="9876543210",
        )


def test_register_passwords_dont_match():
    with pytest.raises(Exception):
        RegisterRequest(
            email="user@example.com",
            password="Password1",
            confirm_password="Password2",
            mobile_number="9876543210",
        )


def test_register_invalid_mobile_too_short():
    with pytest.raises(Exception):
        RegisterRequest(
            email="user@example.com",
            password="Password1",
            confirm_password="Password1",
            mobile_number="123",
        )


def test_register_invalid_mobile_non_digits():
    with pytest.raises(Exception):
        RegisterRequest(
            email="user@example.com",
            password="Password1",
            confirm_password="Password1",
            mobile_number="98765abc10",
        )


# ── Login ──────────────────────────────────────────────────────────────────────

def test_login_success(mock_db, sample_local_user):
    mock_db.users.find_one.return_value = sample_local_user

    data = LoginRequest(email="test@example.com", password="Password1")
    with patch("app.services.user_service.pwd_context.verify", return_value=True):
        result = login_user(mock_db, data)
    assert result.access_token
    assert result.user.auth_provider == "local"


def test_login_wrong_password(mock_db, sample_local_user):
    mock_db.users.find_one.return_value = sample_local_user

    data = LoginRequest(email="test@example.com", password="WrongPass1")
    with patch("app.services.user_service.pwd_context.verify", return_value=False):
        with pytest.raises(HTTPException) as exc_info:
            login_user(mock_db, data)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid email or password."


def test_login_unknown_email(mock_db):
    mock_db.users.find_one.return_value = None

    data = LoginRequest(email="nobody@example.com", password="Password1")
    with pytest.raises(HTTPException) as exc_info:
        login_user(mock_db, data)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid email or password."


def test_login_google_account_returns_400(mock_db, sample_google_user):
    mock_db.users.find_one.return_value = sample_google_user

    data = LoginRequest(email="google@example.com", password="anypassword")
    with pytest.raises(HTTPException) as exc_info:
        login_user(mock_db, data)
    assert exc_info.value.status_code == 400
    assert "Google" in exc_info.value.detail


# ── Google Upsert ──────────────────────────────────────────────────────────────

def test_google_login_new_user(mock_db):
    mock_db.users.find_one.return_value = None
    inserted_id = ObjectId()
    mock_db.users.insert_one.return_value = MagicMock(inserted_id=inserted_id)

    google_info = {"sub": "g123", "email": "new@gmail.com", "name": "New User", "picture": None}
    result = get_or_create_google_user(mock_db, google_info)
    assert result.access_token
    assert result.user.auth_provider == "google"


def test_google_login_existing_google_user(mock_db, sample_google_user):
    mock_db.users.find_one.return_value = sample_google_user

    google_info = {"sub": "g123", "email": "google@example.com", "name": "Google User", "picture": None}
    result = get_or_create_google_user(mock_db, google_info)
    assert result.access_token


def test_google_login_email_already_local(mock_db, sample_local_user):
    mock_db.users.find_one.return_value = sample_local_user

    google_info = {"sub": "g123", "email": "test@example.com", "name": "Test", "picture": None}
    with pytest.raises(HTTPException) as exc_info:
        get_or_create_google_user(mock_db, google_info)
    assert exc_info.value.status_code == 409
