"""
FastAPI application entry point.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.config.database import ensure_indexes
from app.routes import auth, tasks

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Lifespan ───────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: validate settings and ensure DB indexes. Shutdown: nothing special."""
    logger.info("Starting Task Management API...")
    settings.validate()
    ensure_indexes()
    logger.info("Startup complete. Allowed origins: %s", settings.allowed_origins_list)
    yield
    logger.info("Shutting down Task Management API.")


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Task Management API",
    description=(
        "REST API for the Task Management Application. "
        "Supports Google OAuth and email/password authentication with JWT sessions."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(tasks.router)


# ── Health Check ───────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"], summary="Health Check")
def health_check() -> dict:
    """Returns API status. Used for deployment health probes."""
    return {"status": "ok", "service": "Task Management API", "version": "1.0.0"}
