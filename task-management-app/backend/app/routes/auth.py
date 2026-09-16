"""
Authentication routes: Google sign-in, email/password register, email/password login.
"""
from fastapi import APIRouter, Depends
from pymongo.database import Database

from app.config.database import get_db
from app.schemas.auth import GoogleAuthRequest, RegisterRequest, LoginRequest, AuthResponse
from app.services.auth_service import verify_google_token
from app.services.user_service import get_or_create_google_user, register_user, login_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/google",
    response_model=AuthResponse,
    summary="Google Sign-In",
    description="Verify a Google ID token and return a JWT. Creates a user record on first login.",
)
def google_sign_in(
    body: GoogleAuthRequest,
    db: Database = Depends(get_db),
) -> AuthResponse:
    google_info = verify_google_token(body.credential)
    return get_or_create_google_user(db, google_info)


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=201,
    summary="Register with Email/Password",
    description=(
        "Register a new local account. Validates email format, password strength, "
        "confirm_password match, and mobile number format. Auto-logs in on success."
    ),
)
def register(
    body: RegisterRequest,
    db: Database = Depends(get_db),
) -> AuthResponse:
    return register_user(db, body)


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login with Email/Password",
    description=(
        "Authenticate with email and password. Returns a JWT identical in shape to "
        "the Google sign-in response. Generic error on failure to prevent enumeration."
    ),
)
def login(
    body: LoginRequest,
    db: Database = Depends(get_db),
) -> AuthResponse:
    return login_user(db, body)
