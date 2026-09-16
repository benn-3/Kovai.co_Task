# TaskFlow — User Guide

Welcome to **TaskFlow**, a simple and powerful task management application. This guide explains how to use every feature.

---

## Accessing the App

- **Local development:** Open `http://localhost:5173` in your browser after starting the frontend.
- **Production:** Navigate to [https://kovai-co-task.vercel.app/](https://kovai-co-task.vercel.app/)

---

## Signing In

### With Google

1. On the **Login** page, click the **"Continue with Google"** button.
2. A Google Sign-In popup will appear — select your account.
3. You'll be automatically redirected to the Dashboard.

> On first Google sign-in, your account is created automatically. No registration step required.

### With Email and Password

1. On the **Login** page, enter your registered **email** and **password**.
2. Click **"Log In"**.
3. If your credentials are correct, you'll be redirected to the Dashboard.

**Error messages** will appear inline if:
- Email or password is incorrect
- The email is registered as a Google account (you'll be prompted to use "Continue with Google")

---

## Creating an Account (Email/Password)

1. On the **Login** page, click **"Register"** (bottom of the page).
2. Fill in:
   - **Email address** — must be a valid email format
   - **Password** — at least 8 characters, must contain at least one letter and one number
   - **Confirm password** — must match the password exactly
   - **Mobile number** — 10–15 digits only (no spaces, dashes, or letters)
3. Click **"Register"**.
4. You'll be logged in automatically and taken to the Dashboard.

**Validation feedback:**
- Errors appear below each field as you fill in the form (client-side checks).
- The backend re-validates everything and returns field-level errors if anything is wrong.
- If the email is already in use, you'll see a "409 Conflict" error.

---

## Dashboard Overview

After logging in, you'll see the **Dashboard** with:
- **Navbar** — app name, your profile info, dark mode toggle, logout button
- **New Task** form — at the top
- **Filter / Search / Sort** controls — below the form
- **Task list** — your tasks in cards

---

## Creating a Task

1. In the **New Task** panel, enter a **title** (required).
2. Optionally add a **description** and a **due date**.
3. Click **"+ Add Task"**.
4. The task appears at the top of your list with status **Planned**.

---

## Viewing Your Tasks

All your tasks are displayed as cards. Each card shows:
- **Title** and **description**
- **Status badge** (Planned / In Progress / Complete)
- **Created date**
- **Due date** (if set) — highlighted in red with an "Overdue" badge if the due date has passed and the task isn't Complete

---

## Editing a Task

1. Click the **"✏ Edit"** button on any task card.
2. An inline form appears — modify the title and/or description.
3. Click **"Save"** to confirm, or **"Cancel"** to discard changes.

> At least one field (title or description) must be changed. The title cannot be left empty.

---

## Deleting a Task

1. Click the **"🗑 Delete"** button on a task card.
2. A confirmation dialog appears.
3. Click **"Delete"** to confirm, or **"Cancel"** to dismiss.

> Deletion is permanent and cannot be undone.

---

## Changing Task Status

Each task card has a **status dropdown**. Click it and select:
- **Planned** — default for new tasks
- **In Progress** — actively being worked on
- **Complete** — finished

You can change status in any direction at any time.

---

## Filtering Tasks by Status

Above the task list, you'll see **filter tabs**:
- **All** — shows every task
- **Planned** — shows only Planned tasks
- **In Progress** — shows only In Progress tasks
- **Complete** — shows only Complete tasks

Each tab shows a count badge. Click a tab to filter.

---

## Searching Tasks

Use the **search bar** (above the task list) to filter tasks by title. The search is:
- **Case-insensitive**
- **Client-side** — updates instantly as you type
- Applied on top of the active status filter

---

## Sorting Tasks

Click the **"↓ Newest"** / **"↑ Oldest"** sort toggle button to switch between:
- **Newest first** (default) — most recently created tasks at the top
- **Oldest first** — oldest tasks at the top

---

## Status Counts

Three count chips are always displayed above the task list:
- 📋 N Planned
- ⚡ N In Progress
- ✅ N Complete

These update automatically as you create, edit, and delete tasks.

---

## Dark Mode

Click the **☽ / ☀** button in the navbar (or on auth pages) to toggle between light and dark mode. Your preference is saved in your browser and persists across sessions.

---

## Logging Out

Click the **"Logout"** button in the top-right corner of the navbar. You'll be redirected to the Login page and your session token will be cleared.

---

## Session Expiry

JWT sessions expire after **24 hours**. When your session expires:
- You'll be automatically redirected to the Login page on your next action.
- Simply log in again to continue.

---

## Assumptions & Limitations

| Topic | Detail |
|---|---|
| Account linking | Google and email/password accounts sharing the same email are **not linked** — they are separate accounts |
| Password reset | Not available in this version |
| Email verification | Not required — your account is usable immediately |
| Teams/sharing | Not supported — tasks are private to each user |
| Offline | The app requires a connection to the backend server |
| Mobile numbers | Only stored for email/password accounts; Google accounts don't have one |

---

## Setup (for self-hosted users)

See the main [README.md](../README.md) for:
- Backend and frontend local setup instructions
- Environment variable configuration
- MongoDB Atlas setup
- Google OAuth configuration
- Deployment instructions
