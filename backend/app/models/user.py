"""
User document model helpers and field constants.
Defines the shape of a user document in the 'users' MongoDB collection.
"""
from datetime import datetime, timezone
from typing import Optional


def build_google_user(
    email: str,
    google_sub: str,
    name: Optional[str] = None,
    picture: Optional[str] = None,
) -> dict:
    """Build a new user document for a Google-authenticated user."""
    return {
        "email": email.lower().strip(),
        "auth_provider": "google",
        "google_sub": google_sub,
        "name": name,
        "picture": picture,
        "password_hash": None,
        "mobile_number": None,
        "created_at": datetime.now(timezone.utc),
    }


def build_user_document(email, password_hash, mobile_number) -> dict:
    """Build a new user document for a local email/password user."""

    mobile_number = str(mobile_number).strip()

    if not mobile_number.isdigit() or len(mobile_number) != 10:
        raise ValueError("Mobile number must be exactly 10 digits")

    return {
        "email": email.lower().strip(),
        "auth_provider": "local",
        "password_hash": password_hash,
        "mobile_number": mobile_number,
        "name": None,
        "picture": None,
        "created_at": datetime.now(timezone.utc),
    }


def safe_user(user: dict) -> dict:
    """Return a user dict safe for API responses (no password_hash, _id as str id)."""
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name"),
        "picture": user.get("picture"),
        "auth_provider": user["auth_provider"],
        "created_at": user["created_at"].isoformat() if user.get("created_at") else None,
    }
