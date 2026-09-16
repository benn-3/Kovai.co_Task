"""
Google authentication service.
Verifies Google ID tokens using the google-auth library.
"""
import logging
from typing import Optional
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi import HTTPException, status
from app.core.config import settings

logger = logging.getLogger(__name__)

_google_request = google_requests.Request()


def verify_google_token(credential: str) -> dict:
    """
    Verify a Google ID token and return the decoded user info.

    Returns a dict with at minimum: sub, email, name, picture.
    Raises HTTPException 401 on invalid/expired tokens.
    """
    if not settings.GOOGLE_CLIENT_ID:
        logger.error("GOOGLE_CLIENT_ID is not configured.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google authentication is not configured on this server.",
        )

    try:
        id_info = id_token.verify_oauth2_token(
            credential,
            _google_request,
            settings.GOOGLE_CLIENT_ID,
        )
        logger.info("Google token verified for email: %s", id_info.get("email"))
        return {
            "sub": id_info["sub"],
            "email": id_info["email"],
            "name": id_info.get("name"),
            "picture": id_info.get("picture"),
        }
    except ValueError as exc:
        logger.warning("Google token verification failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google credential. Please sign in again.",
        )
