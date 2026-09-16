"""
User service: registration, login, Google user upsert, JWT creation.
Keeps email/password logic entirely separate from Google auth.
"""
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

import jwt
from fastapi import HTTPException, status
from passlib.context import CryptContext
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError

from app.core.config import settings
from app.models.user import build_google_user, build_local_user, safe_user
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse, UserInfo

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── JWT helpers ────────────────────────────────────────────────────────────────

def create_jwt(user_id: str) -> str:
    """Create a signed JWT containing the user_id."""
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRY_HOURS)
    payload = {
        "user_id": user_id,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def _build_auth_response(user: dict) -> AuthResponse:
    """Build the standard AuthResponse from a user document."""
    token = create_jwt(str(user["_id"]))
    user_info = UserInfo(
        id=str(user["_id"]),
        email=user["email"],
        name=user.get("name"),
        picture=user.get("picture"),
        auth_provider=user["auth_provider"],
    )
    return AuthResponse(access_token=token, user=user_info)


# ── Google upsert ──────────────────────────────────────────────────────────────

def get_or_create_google_user(
    db: Database,
    google_info: dict,
) -> AuthResponse:
    """
    Look up a user by email. If they exist (even as a local user sharing the same
    email), we do NOT link accounts — we only upsert Google-provider records.
    On first Google login, insert a new users document.
    Returns AuthResponse with JWT.
    """
    email = google_info["email"].lower().strip()
    existing = db.users.find_one({"email": email})

    if existing:
        if existing["auth_provider"] != "google":
            # Email already registered via local — block account linking
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "This email is already registered with an email/password account. "
                    "Please log in using your email and password instead."
                ),
            )
        logger.info("Google login for existing user: %s", email)
        return _build_auth_response(existing)

    # First Google login — create the user record
    doc = build_google_user(
        email=email,
        google_sub=google_info["sub"],
        name=google_info.get("name"),
        picture=google_info.get("picture"),
    )
    result = db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    logger.info("New Google user created: %s", email)
    return _build_auth_response(doc)


# ── Registration ───────────────────────────────────────────────────────────────

def register_user(db: Database, data: RegisterRequest) -> AuthResponse:
    """
    Register a new local (email/password) user.
    Raises 409 if email already exists.
    Returns AuthResponse with JWT (auto-login after register).
    """
    email = data.email.lower().strip()

    # Pre-check for clearer error message (DuplicateKeyError also caught below)
    existing = db.users.find_one({"email": email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    hashed = pwd_context.hash(data.password)
    doc = build_local_user(
        email=email,
        password_hash=hashed,
        mobile_number=data.mobile_number,
    )

    try:
        result = db.users.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    doc["_id"] = result.inserted_id
    logger.info("New local user registered: %s", email)
    return _build_auth_response(doc)


# ── Login ──────────────────────────────────────────────────────────────────────

def login_user(db: Database, data: LoginRequest) -> AuthResponse:
    """
    Authenticate a local user with email + password.
    Never reveals whether the email exists or which field was wrong.
    Raises 401 for any auth failure, 400 if trying to password-login a Google account.
    """
    email = data.email.lower().strip()
    user = db.users.find_one({"email": email})

    if user and user["auth_provider"] == "google":
        logger.warning("Password login attempted for Google account: %s", email)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This email is registered with Google Sign-In. "
                "Please use the 'Continue with Google' button to log in."
            ),
        )

    # Generic failure for wrong email or wrong password (no enumeration)
    if not user or not user.get("password_hash"):
        logger.warning("Failed login attempt for email: %s (user not found)", email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not pwd_context.verify(data.password, user["password_hash"]):
        logger.warning("Failed login attempt for email: %s (wrong password)", email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    logger.info("Successful login for: %s", email)
    return _build_auth_response(user)
