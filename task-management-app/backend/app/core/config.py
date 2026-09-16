"""
Application settings loaded from environment variables.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-me-in-production")
    JWT_EXPIRY_HOURS: int = int(os.getenv("JWT_EXPIRY_HOURS", "24"))
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    ALLOWED_ORIGIN: str = os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")

    def validate(self) -> None:
        """Raise if critical settings are missing."""
        if not self.MONGODB_URI:
            raise ValueError("MONGODB_URI environment variable is not set.")
        if not self.JWT_SECRET or self.JWT_SECRET == "change-me-in-production":
            import logging
            logging.getLogger(__name__).warning(
                "JWT_SECRET is using a default/insecure value. Set a strong secret in production."
            )


settings = Settings()
