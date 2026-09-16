# 📋 TaskTrac — Production Task Management Application

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20PyMongo-47A248.svg?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Google OAuth](https://img.shields.io/badge/Auth-Google%20OAuth%202.0%20%2B%20JWT-4285F4.svg?style=flat&logo=google&logoColor=white)](https://developers.google.com/identity)
[![Styling](https://img.shields.io/badge/UI-Glassmorphism%20%2B%20Design%20System-8A2BE2.svg?style=flat)](https://developer.mozilla.org)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%20AA%20Compliant-success.svg?style=flat)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **TaskTrac** is a modern, full-stack personal task management platform designed for engineers who demand speed, clarity, and precision. Built with a **FastAPI** Python backend, **React 19** Vite frontend, **MongoDB Atlas** cloud database, dual **Google OAuth 2.0 + JWT** authentication, and a **Glassmorphic UI design system**.

---

## 🌐 Live Deployed Application

| Component | Platform | URL |
|---|---|---|
| **Frontend Application** | **Vercel** | [https://kovai-co-task.vercel.app/](https://kovai-co-task.vercel.app/) |
| **Backend REST API** | **Render** | [https://kovai-co-task.onrender.com](https://kovai-co-task.onrender.com) |
| **Interactive Swagger Docs** | **Render** | [https://kovai-co-task.onrender.com/docs](https://kovai-co-task.onrender.com/docs) |
| **ReDoc API Documentation** | **Render** | [https://kovai-co-task.onrender.com/redoc](https://kovai-co-task.onrender.com/redoc) |

---

## 📑 Table of Contents

- [🌐 Live Deployed Application](#-live-deployed-application)
- [✨ Feature Highlights](#-feature-highlights)
- [🎨 UI & Design Philosophy](#-ui--design-philosophy)
- [🏛️ System Architecture](#️-system-architecture)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🛠️ Tech Stack Specification](#️-tech-stack-specification)
- [⚡ Quick Start & Installation Guide](#-quick-start--installation-guide)
  - [1. Prerequisites](#1-prerequisites)
  - [2. MongoDB Atlas Configuration](#2-mongodb-atlas-configuration)
  - [3. Google OAuth 2.0 Configuration](#3-google-oauth-20-configuration)
  - [4. Backend Setup & Run](#4-backend-setup--run)
  - [5. Frontend Setup & Run](#5-frontend-setup--run)
- [📡 API Reference](#-api-reference)
- [🗄️ Database Schema & Security](#️-database-schema--security)
- [🚀 Production Deployment Guide](#-production-deployment-guide)
- [🧪 Testing & Verification](#-testing--verification)
- [🤖 AI Usage Summary](#-ai-usage-summary)
- [👨‍💻 Author & Assessment Notes](#-author--assessment-notes)

---

## ✨ Feature Highlights

### 🎯 Core Task Management
- **3-Lane Kanban Board**: Structured side-by-side workflow across three definitive states: `Planned`, `In Progress`, and `Complete`.
- **Fast Task Creation**: Inline form with title, optional rich description, and datetime due date picker.
- **Full In-Place Editing**: Edit task details directly within card view with form validation.
- **Accessible Deletion**: Two-step modal confirmation dialog with background blur to prevent accidental deletion.
- **Status Transitions**: Move tasks seamlessly between any status with instant visual feedback.

### 🔍 Productivity & Controls
- **Live Instant Search**: Filter tasks dynamically by keyword in title without reloading.
- **Multi-Directional Sorting**: One-click toggle between `↓ Newest First` and `↑ Oldest First`.
- **Real-Time Task Counters**: Automatic live counts per lane and total task count.
- **Overdue Visual Warning**: Automatic highlight badges for incomplete tasks past their deadline.
- **Smart Empty States**: Contextual guidance for blank boards and lanes (`Nothing planned yet`, `Nothing in progress`).

### 🔐 Authentication & Session Security
- **Dual Authentication**:
  - **Google Identity Services (GIS)**: One-tap OAuth 2.0 with cryptographic credential verification.
  - **Email & Password**: Registration with client-side & server-side regex validation, hashed with `bcrypt` (12 rounds).
- **Stateless JWT Sessions**: Signed PyJWT tokens (24-hour expiration) stored securely with auto-expiry redirection on 401.
- **User Data Isolation**: Queries strictly filter by JWT `user_id` — users cannot access or modify tasks belonging to other accounts.

---

## 🎨 UI & Design Philosophy

TaskTrac embraces a **Glassmorphism** design system with a calm, focused workbench aesthetic:

1. **Ambient Gradient Mesh**: A fixed, GPU-accelerated background layer with three soft blurred radial blobs (accent, in-progress amber, complete green) that drift slowly (`±20px`), bringing frosted glass surfaces to life.
2. **Selective Glass Application**:
   - **Full Glass (`backdrop-filter: blur(16px)`)**: Sticky navigation bar, desktop auth split-panels, "New task" creator panel, and floating toast confirmations.
   - **Lighter Glass (`backdrop-filter: blur(8px)`, ~0.82 opacity)**: Task cards for maximum text contrast and 60fps rendering performance.
   - **Solid Interactive Controls**: Inputs, status selects, and primary buttons remain solid for instant visual affordance.
3. **Split-Panel Authentication**:
   - Left panel: Minimalist technical dot-grid texture with brand mark and tagline.
   - Right panel: Centered sign-in / registration form with Google OAuth and email fallbacks.
4. **Transient Feedback Toasts**: Clean bottom-right toasts (`Task created`, `Status updated`, `Task deleted`) that auto-dismiss in 2.5 seconds with zero notification noise.
5. **Theme Engine**: Complete Dark and Light mode support with curated tokens, persistent `localStorage` memory, and Lucide Sun/Moon iconography.
6. **Strict Accessibility (WCAG AA)**: Clear focus rings, 8px layout grid, and full `prefers-reduced-motion` compliance.

---

## 🏛️ System Architecture

```
                                  ┌───────────────────────────┐
                                  │      Client Browser       │
                                  │   (React 19 + Vite SPA)   │
                                  └─────────────┬─────────────┘
                                                │
                                HTTPS Requests  │  Bearer JWT Authorization
                                                ▼
                                  ┌───────────────────────────┐
                                  │      FastAPI Backend      │
                                  │      (Uvicorn Engine)     │
                                  └──────┬─────────────┬──────┘
                                         │             │
                    ┌────────────────────┴──┐       ┌──┴────────────────────┐
                    ▼                       ▼       ▼                       ▼
            ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
            │ /api/auth/*   │       │ /api/tasks/*  │       │ Google Auth   │
            │ Login/Register│       │ CRUD Handlers │       │ API Verify    │
            └───────┬───────┘       └───────┬───────┘       └───────────────┘
                    │                       │
                    └───────────┬───────────┘
                                │ PyMongo Driver
                                ▼
                    ┌───────────────────────────┐
                    │    MongoDB Atlas Cluster  │
                    │   Collections: users/tasks│
                    └───────────────────────────┘
```

### Data Flow Overview
1. **Client Request**: Frontend communicates via Axios client (`src/services/api.js`) with request interceptors automatically attaching `Authorization: Bearer <jwt>`.
2. **Backend Authentication**: `get_current_user` FastAPI dependency decodes token, checks `exp`, and extracts authenticated `user_id`.
3. **Database Execution**: `TaskService` processes MongoDB operations targeting documents scoped strictly to the current user's ObjectId.
4. **Response Serialization**: Pydantic v2 validates and serializes responses to JSON format with ISO-8601 timestamps.

---

## 📂 Project Directory Structure

```
Kovai.co_Task/
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI initialization, CORS, routing
│   │   ├── core/
│   │   │   └── config.py           # Pydantic BaseSettings (.env loader)
│   │   ├── config/
│   │   │   └── database.py         # MongoDB connection & index configuration
│   │   ├── middleware/
│   │   │   └── auth.py             # JWT verification & dependency injection
│   │   ├── models/
│   │   │   ├── task.py             # Task entity helpers & mappings
│   │   │   └── user.py             # User entity helpers & mappings
│   │   ├── routes/
│   │   │   ├── auth.py             # Auth endpoints (Register, Login, Google)
│   │   │   └── tasks.py            # Task CRUD endpoints (Protected)
│   │   ├── schemas/
│   │   │   ├── task.py             # Pydantic models for Task input/output
│   │   │   └── user.py             # Pydantic models for Auth input/output
│   │   └── services/
│   │       ├── auth_service.py     # Password hashing & JWT generation
│   │       ├── google_service.py   # Google OAuth token verification
│   │       ├── task_service.py     # Task persistence logic
│   │       └── user_service.py     # User query & creation logic
│   ├── tests/                      # Unit & integration tests
│   ├── .env.example                # Backend environment template
│   ├── requirements.txt            # Python dependencies
│   └── runtime.txt                 # Render Python 3.12 runtime pin
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Sticky glass header with user avatar
│   │   │   ├── TaskCard.jsx        # Glass card, status border, inline edit, actions
│   │   │   ├── TaskFilters.jsx     # Status tabs, search input, and sort toggles
│   │   │   ├── TaskForm.jsx        # Compact task creation form
│   │   │   ├── TaskList.jsx        # 3-lane Kanban & task grid layout
│   │   │   └── ThemeToggle.jsx     # Sun/Moon mode switcher (Lucide icons)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # User session state & token management
│   │   │   ├── ThemeContext.jsx    # Dark/Light theme state
│   │   │   └── ToastContext.jsx    # Transient toast notifications provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # 3-lane Kanban board, toolbar, skeleton loading
│   │   │   ├── Login.jsx           # Split-panel login with Google One-Tap
│   │   │   └── Register.jsx        # Split-panel registration with live validation
│   │   ├── services/
│   │   │   └── api.js              # Central Axios client with interceptors
│   │   ├── App.jsx                 # Route configurations & ambient gradient mesh
│   │   ├── index.css               # Complete Glassmorphism & Token design system
│   │   └── main.jsx                # React root entry point
│   ├── index.html                  # SVG favicon & IBM Plex Sans font links
│   ├── package.json                # NPM package definitions
│   ├── tailwind.config.js          # Tailwind CSS configurations
│   └── vercel.json                 # Vercel SPA routing rewrite config
│
└── docs/
    ├── README.md                   # Comprehensive end-user documentation
    └── AI_USAGE.md                 # Detailed AI Usage & Disclosure Report
```

---

## 🛠️ Tech Stack Specification

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React | `^19.0.0` | UI Component Tree & Virtual DOM |
| **Build Tool** | Vite | `^6.0.0` | Ultra-fast HMR and optimized production bundle |
| **Routing** | React Router DOM | `^6.28.0` | Declarative client-side routing & auth guards |
| **Icons** | Lucide React | `^0.475.0` | Clean, modern vector UI iconography |
| **Backend Framework** | FastAPI | `^0.115.0` | High-performance asynchronous REST API |
| **ASGI Web Server** | Uvicorn | `^0.32.0` | Production-grade server for Python ASGI apps |
| **Database** | MongoDB Atlas / PyMongo | `^4.10.0` | Scalable NoSQL document store |
| **Data Validation** | Pydantic v2 | `^2.10.0` | Robust schema definition and input sanitation |
| **Authentication** | PyJWT | `^2.10.0` | Cryptographic JSON Web Token signing & decoding |
| **Password Hashing** | Bcrypt / Passlib | `^1.7.4` | Industry-standard salt-hashed passwords |
| **Google Auth** | google-auth | `^2.37.0` | Secure verification of Google OAuth 2.0 ID tokens |

---

## ⚡ Quick Start & Installation Guide

### 1. Prerequisites
- **Node.js**: `v18.0.0+` or `v20.0.0+` ([Download Node.js](https://nodejs.org))
- **Python**: `3.12.0+` ([Download Python](https://www.python.org))
- **MongoDB Atlas** database account or local MongoDB server
- **Git** version control tool

---

### 2. MongoDB Atlas Configuration
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free M0 Shared Cluster.
2. In **Database Access**, create a user with `Read and write to any database` permissions.
3. In **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere) or your specific IP.
4. Click **Connect** → **Drivers** (Python 3.12+) and copy your connection string:
   ```env
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/TaskTrac?retryWrites=true&w=majority
   ```

---

### 3. Google OAuth 2.0 Configuration
1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named `TaskTrac`.
3. Go to **APIs & Services → OAuth consent screen**:
   - User Type: **External**
   - Provide Application name, support email, and developer contact.
4. Go to **Credentials → Create Credentials → OAuth Client ID**:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://127.0.0.1:5173`
5. Copy the generated **Client ID** (e.g., `128647295018-...apps.googleusercontent.com`).

---

### 4. Backend Setup & Run

Open a terminal in the project directory:

```bash
# Navigate to backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# macOS / Linux:
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt
```

Create `backend/.env` (or copy from `.env.example`):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/TaskTrac?retryWrites=true&w=majority
DB_NAME=TaskTrac
JWT_SECRET=super-secret-jwt-key-minimum-32-chars-long-random-string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
> 🚀 **Backend runs at:** `http://localhost:8000`  
> 📖 **Interactive Swagger API Docs:** `http://localhost:8000/docs`

---

### 5. Frontend Setup & Run

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# (Optional verify) Install icons if needed
npm install lucide-react
```

Create `frontend/.env` (or copy from `.env.example`):
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Start the Vite development server:
```bash
npm run dev
```
> 💻 **Frontend opens at:** `http://localhost:5173`

---

## 📡 API Reference

All protected endpoints require the HTTP Authorization header:
`Authorization: Bearer <your_jwt_token>`

### 🔑 Authentication Endpoints

| Method | Endpoint | Access | Description | Payload Sample |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new email/password account | `{"email": "user@test.com", "password": "Password123", "mobile_number": "9876543210"}` |
| `POST` | `/api/auth/login` | Public | Login with email/password | `{"email": "user@test.com", "password": "Password123"}` |
| `POST` | `/api/auth/google` | Public | Authenticate via Google ID Token | `{"credential": "<google_jwt_token>"}` |
| `GET` | `/api/auth/me` | Protected | Fetch profile of signed-in user | *None* |

### 📝 Task Endpoints

| Method | Endpoint | Access | Description | Query Parameters / Body |
|---|---|---|---|---|
| `GET` | `/api/tasks/` | Protected | Fetch tasks of authenticated user | `?status=Planned` *(optional filter)* |
| `POST` | `/api/tasks/` | Protected | Create a new task | `{"title": "Task title", "description": "Details", "due_date": "2026-09-30T10:00:00"}` |
| `GET` | `/api/tasks/{id}` | Protected | Retrieve specific task details | *Path param: id* |
| `PUT` | `/api/tasks/{id}` | Protected | Update task title, description, or due date | `{"title": "New Title", "description": "New Desc"}` |
| `PATCH`| `/api/tasks/{id}/status`| Protected | Transition task status | `{"status": "In Progress"}` *(Planned / In Progress / Complete)* |
| `DELETE`| `/api/tasks/{id}` | Protected | Delete task permanently | *Path param: id* |

---

## 🗄️ Database Schema & Security

### `users` Collection
```json
{
  "_id": ObjectId("665a1b2c3d4e5f6a7b8c9d0e"),
  "email": "developer@example.com",
  "password_hash": "$2b$12$e8x... (null for pure Google OAuth users)",
  "name": "Dev User",
  "picture": "https://lh3.googleusercontent.com/a/...",
  "mobile_number": "9876543210",
  "created_at": ISODate("2026-09-16T05:00:00.000Z"),
  "updated_at": ISODate("2026-09-16T05:00:00.000Z")
}
```
*Index*: Unique index on `email`.

### `tasks` Collection
```json
{
  "_id": ObjectId("665a2c3d4e5f6a7b8c9d0f1a"),
  "user_id": ObjectId("665a1b2c3d4e5f6a7b8c9d0e"),
  "title": "Build Glassmorphism Task UI",
  "description": "Implement 3-blob background mesh and frosted glass panels.",
  "status": "In Progress",
  "due_date": ISODate("2026-09-20T18:00:00.000Z"),
  "created_at": ISODate("2026-09-16T05:30:00.000Z"),
  "updated_at": ISODate("2026-09-16T06:15:00.000Z")
}
```
*Indexes*: Compound index on `(user_id, status)` and `(user_id, created_at)`.

---

## 🚀 Production Deployment Guide

### Deploying Backend to Render
1. Create a new **Web Service** connected to your repository.
2. Set root directory to `backend`.
3. Set Environment to **Python 3**.
4. Build Command:
   ```bash
   pip install -r requirements.txt
   ```
5. Start Command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. Add Environment Variables: `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `FRONTEND_URL`.

### Deploying Frontend to Vercel / Netlify
1. Connect repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variables:
   - `VITE_API_URL`: URL of your deployed Render backend (e.g. `https://kovai-co-task.onrender.com`)
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
7. Ensure your production URL is whitelisted in Google Cloud Console Credentials.

---

## 🧪 Testing & Verification

### Frontend Production Build Test
To verify the application compiles clean with zero warnings or errors:
```bash
cd frontend
npm run build
```
Output:
```
✓ built in ~7s
dist/index.html                   1.13 kB
dist/assets/index-*.css          24.88 kB
dist/assets/index-*.js          339.88 kB
```

### Health Check Endpoint
To verify the backend server is running and responding:
```bash
curl http://localhost:8000/
```
Response:
```json
{"status": "healthy", "service": "Task Management API"}
```

---

## 🤖 AI Usage Summary

> Detailed report available at: [docs/AI_USAGE.md](file:///c:/Important/College/Project/Kovai.co_Task/docs/AI_USAGE.md)

In accordance with transparent engineering assessment practices, this section summarizes the usage of Artificial Intelligence (AI) tools during the design and development of **TaskTrac**.

### 🛠️ Tools Used
- **Claude (Anthropic)**: Used for architecture brainstorming, boilerplate schema generation, Glassmorphic CSS token assistance, and documentation drafting.
- **ChatGPT (OpenAI)**: Used for code drafting, regex validation patterns, test fixture scaffolding, and syntax lookups.

### 📊 Effort & Contribution Breakdown

| Category | AI Contribution | Human Authorship | Primary Human Responsibility |
|---|:---:|:---:|---|
| **System Architecture** | 10% | 90% | Tech stack selection, stateless JWT design, multi-tenant database isolation |
| **Backend Engineering** | 25% | 75% | Business logic, PyMongo indexing, bcrypt security, Render runtime fixes |
| **Frontend Engineering** | 20% | 80% | React 19 architecture, Context providers, Kanban layout, Axios interceptors |
| **UI Styling & Polish** | 40% | 60% | Glassmorphism design tokens, layout hierarchy, dark/light theme engine |
| **Validation & Security** | 20% | 80% | Mobile number regex (10-15 digits), password rules, user ID scoping |
| **Testing & Verification** | 20% | 80% | Test case formulation, end-to-end QA, production build and API checks |
| **Documentation & Cloud**| 40% | 60% | Vercel & Render cloud deployments, OAuth origin setup, User Guide |
| **Overall Project Effort**| **~25%** | **~75%** | **End-to-end architecture, technical decisions, and code validation** |

### 🔒 Human Validation & Security Protocol
1. **Zero Unchecked Code**: All AI-assisted code was reviewed line-by-line, refactored to conform to project architecture, and manually tested.
2. **Security & Secrets**: No secrets, API keys, or database credentials were hardcoded; all configuration is managed via strict environment variables.
3. **Data Scoping**: Every database read, write, update, and delete operation is explicitly validated and filtered by the authenticated user's ID to prevent IDOR vulnerabilities.
4. **Verification**: Full static analysis (`oxlint`), production build (`npm run build`), and live cloud endpoint testing were conducted before submission.

---

## 👨‍💻 Author & Assessment Notes

- **Task**: Task Management Application (Kovai.co Engineering Assessment)
- **Author**: Benny Hinn ([bennyhinm18@gmail.com](mailto:bennyhinm18@gmail.com))
- **Built with**: React 19, FastAPI, MongoDB Atlas, JWT, TailwindCSS, Glassmorphism UI
- **Live URLs**:
  - Frontend (Vercel): [https://kovai-co-task.vercel.app/](https://kovai-co-task.vercel.app/)
  - Backend API (Render): [https://kovai-co-task.onrender.com](https://kovai-co-task.onrender.com)
  - API Docs (Swagger): [https://kovai-co-task.onrender.com/docs](https://kovai-co-task.onrender.com/docs)
- **Status**: Production Ready & Fully Verified