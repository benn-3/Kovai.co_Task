# 🤖 AI Usage & Disclosure Report

**Project:** TaskTrac — Production Task Management Application  
**Assessment:** Kovai.co Engineering Assessment  
**Author:** Benny Hinn ([bennyhinm18@gmail.com](mailto:bennyhinm18@gmail.com))  
**Date:** September 2026  
**Status:** Verified & Submitted  

---

## 1. Executive Summary

This document provides a transparent, detailed disclosure of the use of Artificial Intelligence (AI) tools throughout the design, development, testing, and documentation of **TaskTrac**. 

As part of the Kovai.co engineering submission guidelines, this report outlines:
1. Which AI tools and systems were employed.
2. The specific areas where AI provided assistance.
3. The core engineering decisions, architecture, and manual validations carried out by the author.
4. The iterative review and verification methodology used to ensure correctness, performance, and security.

---

## 2. AI Tools & Environments Utilized

| Tool / Model | Primary Purpose | Usage Scope |
|---|---|---|
| **Claude (Anthropic)** | Architecture brainstorming, boilerplate generation, CSS glassmorphic tokens, and documentation structure | Development workflow & design assistance |
| **ChatGPT (OpenAI)** | Code drafting, regex validation patterns, test fixture scaffolding, and syntax lookups | Debugging & syntax assistance |

---

## 3. Breakdown of AI vs. Human Contributions

### 🏛️ Architecture & System Design
- **Human Responsibility (90%)**:
  - Selected the core tech stack: FastAPI (Python 3.12+), React 19, Vite, MongoDB Atlas, and Tailwind CSS.
  - Designed the stateless JWT authentication flow with 24-hour expiration.
  - Formulated the multi-tenant data isolation principle: every MongoDB query is strictly scoped by the authenticated user's `user_id`.
  - Defined the dual-authentication strategy: Google Identity Services (GIS) OAuth 2.0 token verification + Email/Password registration with bcrypt.
- **AI Contribution (10%)**:
  - Formatted architecture diagrams (ASCII / Mermaid) and validated RESTful endpoint naming conventions against OpenAPI standards.

### ⚙️ Backend Development (FastAPI + MongoDB)
- **Human Responsibility (75%)**:
  - Implemented the database connection lifecycle, PyMongo collection indexing (`user_id`, `status`, `created_at`), and repository service patterns.
  - Enforced security rules: 12-round bcrypt password hashing, token validation middleware (`get_current_user`), and strict CORS origin whitelisting.
  - Handled edge cases: phone number regex validation (10–15 digits E.164 compliance), account non-collision rules between Google and Email/Password users, and Pydantic v2 error serialization.
  - Resolved deployment runtime compatibility (pinning Python 3.12 on Render via `runtime.txt` and `.python-version`).
- **AI Contribution (25%)**:
  - Generated initial boilerplate for Pydantic request/response schemas (`TaskCreate`, `TaskUpdate`, `UserRegister`).
  - Suggested boilerplate structure for FastAPI route handlers and standard HTTP exception raising.

### 🎨 Frontend Development (React 19 + Vite + Tailwind CSS)
- **Human Responsibility (70%)**:
  - Structured application architecture: React Context providers (`AuthContext`, `ThemeContext`, `ToastContext`), Axios interceptors with automatic Bearer token injection and 401 redirect handling.
  - Built the 3-lane Kanban board layout (`Planned`, `In Progress`, `Complete`), real-time search filtering, status counters, and dual-mode sorting.
  - Implemented client-side input validation with instant feedback on blur and form submit.
  - Configured Google One-Tap / GIS script loading and token exchange flow.
- **AI Contribution (30%)**:
  - Assisted with Glassmorphism Tailwind utility combinations (gradient mesh background blobs, frosted glass blur filters, border highlights).
  - Drafted CSS keyframe animations for the ambient floating gradient blobs.
  - Suggested responsive layout classes and Lucide icon selections for optimal visual hierarchy.

### 🧪 Testing & Quality Assurance
- **Human Responsibility (80%)**:
  - Formulated test scenarios for authentication failure modes (duplicate email, wrong password, expired token, unlinked accounts).
  - Designed task CRUD integration tests verifying isolation between different user IDs.
  - Executed end-to-end manual testing of dark/light theme switching, responsive viewports, and live production endpoints on Vercel and Render.
  - Performed build validation with `vite build` and linting with `oxlint`.
- **AI Contribution (20%)**:
  - Scaffolding pytest fixtures (`client`, `test_user_token`) in `tests/conftest.py`.
  - Generating initial assertions for status code and payload structure tests.

### 📝 Documentation & Deployment
- **Human Responsibility (60%)**:
  - Configured hosting platforms: Render Web Service for FastAPI, Vercel for Vite React SPA.
  - Configured environment variable schemas, MongoDB network access rules, and Google Cloud Console OAuth Authorized Origins.
  - Wrote step-by-step user guide and troubleshooting notes.
- **AI Contribution (40%)**:
  - Polished markdown formatting, tables of contents, badges, and curl command snippets in `README.md`.

---

## 4. Responsibility & Effort Matrix

| Functional Area | AI Assistance | Human Authorship | Primary Human Role |
|---|:---:|:---:|---|
| **System Architecture** | 10% | 90% | Stack selection, auth design, security model |
| **Backend API & Database** | 25% | 75% | Business logic, security, index design, debugging |
| **Frontend Architecture** | 20% | 80% | State management, routing, API interceptors |
| **UI Design & Styling** | 40% | 60% | Design system tokens, layout integration, polish |
| **Validation & Edge Cases** | 20% | 80% | Phone number regex, error handling, password rules |
| **Testing & QA** | 20% | 80% | Test case formulation, verification, manual QA |
| **Documentation & Deployment** | 40% | 60% | Cloud setup, OAuth whitelist, technical writing |
| **Overall Project Effort** | **~25%** | **~75%** | **End-to-end engineering, decision making, validation** |

---

## 5. Engineering Verification Protocol

To maintain high code quality and strict adherence to software engineering best practices, the following protocol was enforced for all AI-assisted suggestions:

1. **No Unchecked Code Generation**: Every AI-generated code block was reviewed line-by-line before inclusion.
2. **Automated Verification**:
   - Frontend: Static analysis run via `npm run lint` (`oxlint`) and zero-warning production build verified via `npm run build`.
   - Backend: Unit tests run via `pytest`, verifying authentication and CRUD authorization boundaries.
3. **Security Auditing**:
   - Ensured no sensitive credentials (MongoDB connection strings, JWT secrets, Google OAuth secrets) were hardcoded.
   - Verified that user input is validated through Pydantic models to prevent injection attacks.
   - Validated that all database queries filter by authenticated `user_id` to prevent Insecure Direct Object References (IDOR).
4. **Production Deployment Testing**: Both deployed applications (Vercel and Render) were tested live with independent user accounts and network throttles.

---

## 6. Candidate Statement

> *"I certify that the architecture, business logic, data models, and key technical decisions behind TaskTrac represent my own engineering work. AI tools were utilized as an accelerator for boilerplate code, styling ideas, and documentation formatting under strict supervision, line-by-line review, and manual verification."*  
>  
> — **Benny Hinn**  
