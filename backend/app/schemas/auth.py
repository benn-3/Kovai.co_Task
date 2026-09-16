"""
Pydantic schemas for authentication request/response validation.
"""
import re
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator, model_validator


# ── Request Schemas ────────────────────────────────────────────────────────────

class GoogleAuthRequest(BaseModel):
    credential: str  # The Google ID token from the frontend


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str
    mobile_number: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("Password must contain at least one letter.")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number.")
        return v

    @field_validator("mobile_number")
    @classmethod
    def mobile_format(cls, v: str) -> str:
        if not re.fullmatch(r"\d{10,15}", v):
            raise ValueError("Mobile number must be 10–15 digits (digits only).")
        return v

    @model_validator(mode="after")
    def passwords_match(self) -> "RegisterRequest":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ── Response Schemas ───────────────────────────────────────────────────────────

class UserInfo(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    auth_provider: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo
