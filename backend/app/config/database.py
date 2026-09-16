"""
Database configuration and connection management.
Single reused PyMongo client for the application lifetime.
"""
import logging
from functools import lru_cache
from pymongo import MongoClient, DESCENDING
from pymongo.errors import ConnectionFailure, ConfigurationError
from app.core.config import settings

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_mongo_client() -> MongoClient:
    """Return (and cache) a single MongoClient instance."""
    try:
        client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
        # Ping to validate connection on startup
        client.admin.command("ping")
        logger.info("MongoDB connection established successfully.")
        return client
    except (ConnectionFailure, ConfigurationError) as exc:
        logger.error("Failed to connect to MongoDB: %s", exc)
        raise


def get_database():
    """Return the application database."""
    client = get_mongo_client()
    db_name = settings.MONGODB_URI.split("/")[-1].split("?")[0] or "taskapp"
    return client[db_name]


def get_db():
    """FastAPI dependency that returns the database."""
    return get_database()


def ensure_indexes() -> None:
    """Create required indexes on startup. Safe to call multiple times."""
    try:
        db = get_database()
        # Unique index on users.email
        db.users.create_index("email", unique=True, background=True)
        # Index on tasks.user_id for efficient per-user queries
        db.tasks.create_index("user_id", background=True)
        # Index on tasks.created_at for sorting
        db.tasks.create_index([("created_at", DESCENDING)], background=True)
        logger.info("Database indexes ensured.")
    except Exception as exc:
        logger.error("Failed to create indexes: %s", exc)
        raise
