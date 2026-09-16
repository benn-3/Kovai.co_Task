# TaskFlow — Task Management Application

A production-ready, full-stack Task Management Application with Google Sign-In and email/password authentication, JWT sessions, a FastAPI backend, React frontend, and MongoDB Atlas database.

---

## Features

### Core Features
1. Sign in with Google **or** register/log in with email + password
2. Create tasks (title required, description + due date optional)
3. View your task list
4. Edit task title and description
5. Delete tasks (with confirmation)
6. Update task status: **Planned → In Progress → Complete** (any-to-any)
7. Filter tasks by status
8. Search tasks by title (client-side)
9. Toggle sort order (newest/oldest first, client-side)
10. Status counts displayed (Planned / In Progress / Complete)
11. Toggle dark mode (persisted in localStorage)

### Additional Features
- Overdue task highlighting (due date in the past and status not Complete)
- JWT auto-expiry detection — redirects to login on expired tokens
- Loading and error states throughout the UI
- Accessible, responsive design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript, React Router v6, TailwindCSS v3 |
| Backend | Python 3.12+, FastAPI, Uvicorn, Pydantic v2 |
| Database | MongoDB Atlas via PyMongo |
| Authentication | JWT (PyJWT), Google OAuth (google-auth), bcrypt (passlib) |
| Deployment | Vercel (FE), Render (BE), MongoDB Atlas |

---

## Architecture

```
Browser (React)
    │
    │  HTTPS (Axios + Bearer JWT)
    ▼
FastAPI (Uvicorn)
    │
    ├── /api/auth/*  ── AuthService / UserService / GoogleAuthService
    │                    └─ Users collection (MongoDB)
    │
    └── /api/tasks/* ── TaskService (JWT-protected)
                         └─ Tasks collection (MongoDB)
```

**Auth flow:**
1. User signs in via Google or email/password
2. Backend verifies credentials, issues a signed JWT (24h expiry)
3. Frontend stores JWT in localStorage, attaches as `Authorization: Bearer` header
4. Backend JWT middleware verifies token on every protected request and extracts `user_id`
5. Task ownership is enforced using only the JWT-derived `user_id`

---

## Project Structure

```
task-management-app/
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, TaskForm, TaskCard, TaskList, TaskFilters, ThemeToggle
│   │   ├── pages/          # Login, Register, Dashboard
│   │   ├── services/       # api.js (Axios)
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── App.jsx         # React Router setup
│   │   ├── main.jsx
│   │   └── index.css       # CSS design system
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI app, CORS, routers
│   │   ├── core/config.py  # Settings from .env
│   │   ├── config/database.py  # PyMongo client, indexes
│   │   ├── models/         # Document shape helpers
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── routes/         # auth.py, tasks.py
│   │   ├── services/       # auth_service, user_service, task_service
│   │   └── middleware/auth.py  # JWT verification dependency
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── docs/README.md
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Python** 3.12+
- **Node.js** 18+ and npm
- **MongoDB Atlas** account (free tier)
- **Google Cloud Console** project with OAuth 2.0 credentials

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-management-app
```

### 2. MongoDB Setup

1. Create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
2. Create a database user with read/write access
3. Whitelist your IP (or `0.0.0.0/0` for development)
4. Get your connection string: `mongodb+srv://<user>:<pass>@<cluster>/<dbname>?retryWrites=true&w=majority`
5. Collections `users` and `tasks` are created automatically on first use

### 3. Google Authentication Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable the **Google Identity** API
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - Your Vercel/Netlify production URL
7. Copy the **Client ID** (format: `xxxx.apps.googleusercontent.com`)
8. You do **not** need the client secret for this implementation (uses the Identity Services JS library)

---

## Environment Variables

### Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env` and fill in real values:

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=a-very-long-random-string-at-least-32-chars
JWT_EXPIRY_HOURS=24
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
ALLOWED_ORIGIN=http://localhost:5173
```

> **Never commit `.env` files. Only `.env.example` files are committed.**

### Frontend — `frontend/.env`

Copy `frontend/.env.example` to `frontend/.env` and fill in real values:

```
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
```

---

## Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Copy and fill in .env
copy .env.example .env
# Edit .env with your credentials
```

---

## Frontend Setup

```bash
cd frontend

# Install dependencies (already done if you ran npm install)
npm install

# Copy and fill in .env
copy .env.example .env
# Edit .env with your credentials
```

---

## Running the Application

### Backend (terminal 1)

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API is available at: `http://localhost:8000`
Swagger docs: `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

### Frontend (terminal 2)

```bash
cd frontend
npm run dev
```

App is available at: `http://localhost:5173`

---

## Running Tests

```bash
cd backend
venv\Scripts\activate
pip install pytest
pytest tests/ -v
```

Tests cover: registration validation, login failures, wrong-provider login, Google upsert, task CRUD, ownership enforcement, invalid status, missing title, and more.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | — | Health check |
| `POST` | `/api/auth/google` | — | Google Sign-In → JWT |
| `POST` | `/api/auth/register` | — | Register (email/password) → JWT |
| `POST` | `/api/auth/login` | — | Login (email/password) → JWT |
| `GET` | `/api/tasks` | JWT | List tasks (optional `?status=`) |
| `POST` | `/api/tasks` | JWT | Create task |
| `PATCH` | `/api/tasks/{id}` | JWT | Update title/description |
| `PATCH` | `/api/tasks/{id}/status` | JWT | Update status |
| `DELETE` | `/api/tasks/{id}` | JWT | Delete task (204) |

---

## Deployment

### Backend → Render

1. Push to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as `backend/.env`) in the Render dashboard
6. Set `ALLOWED_ORIGIN` to your Vercel/Netlify frontend URL

### Frontend → Vercel

1. Import your GitHub repo in [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Framework preset: **Vite**
4. Add environment variables:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://your-app.onrender.com`)
   - `VITE_GOOGLE_CLIENT_ID` = your Google OAuth client ID
5. Add your Vercel domain to Google Cloud Console's authorized origins

---

## Email/Password Auth Notes

- Passwords are hashed with **bcrypt** via `passlib`. Plaintext passwords are never stored or logged.
- `password_hash` is never included in any API response.
- Login failure always returns the same generic message (`"Invalid email or password."`) — no enumeration.
- If a Google-registered email is used to attempt password login, a clear error is returned: "Please use Continue with Google."
- Accounts from different providers (same email) are **not linked** — this is by design.

---

## Assumptions

- A user is identified by their email across sign-in providers, but accounts are **not linked** if an email exists in both Google and local flows (spec requirement).
- JWT expiry is fixed (24h by default). There is no refresh token flow; users must re-login after expiry.
- No email verification or OTP is implemented (out of scope per spec).
- Task filtering by status triggers a backend query; search and sort are client-side.
- No pagination — all tasks for a user are returned in one query.

---

## Known Limitations

- Google Sign-In requires a valid `GOOGLE_CLIENT_ID` and an internet connection to verify tokens.
- No rate limiting is implemented on auth endpoints (out of scope per spec).
- No password reset flow (out of scope per spec).
- The app is single-user per account — no teams, sharing, or collaboration features.
- `allow_origins=["*"]` is **not** used. In production, set `ALLOWED_ORIGIN` to your specific frontend domain.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Backend won't start | Check `MONGODB_URI` is set and MongoDB Atlas IP whitelist includes your IP |
| Google Sign-In shows error | Verify `VITE_GOOGLE_CLIENT_ID` matches Google Cloud Console and the domain is authorized |
| 401 on all API calls | Check your JWT hasn't expired; try logging out and back in |
| CORS errors | Ensure `ALLOWED_ORIGIN` in backend `.env` exactly matches your frontend URL (no trailing slash) |
| `pymongo.errors.ConfigurationError` | Your MongoDB URI might be malformed; re-copy it from Atlas |
| Tasks not loading | Check browser console and network tab; verify backend is running on port 8000 |

---

## AI Usage Summary

This project was built with AI assistance (Antigravity / Google Gemini). AI was used for:

- **Scaffolding**: Generating the project structure, boilerplate, and configuration files
- **Backend**: FastAPI app, Pydantic schemas, service layer logic, JWT implementation, bcrypt integration, PyMongo queries
- **Frontend**: React components, context providers, CSS design system, form validation logic
- **Testing**: pytest fixtures, unit tests for auth and task services
- **Documentation**: This README and the user documentation

All generated code was reviewed for correctness against the specification before delivery. Security-sensitive logic (JWT verification, password hashing, ownership enforcement, CORS, error message sanitization) was explicitly verified against the spec requirements.
