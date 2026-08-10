# TaskFlow.io - Production-Ready Task Manager

TaskFlow is a modern, high-performance, full-stack Task Manager web application engineered with **Next.js 14/15 (App Router)**, **TypeScript**, **Tailwind CSS**, **PostgreSQL / Supabase**, and a RESTful API architecture.

---

## 🌟 Features

- **Full CRUD Support**: Create, Read, Update, Delete tasks with instant UI response.
- **Completion Toggles**: Quick check/uncheck status updates with real-time stats recalculation.
- **Search, Filter & Sort**:
  - Full-text search across titles and descriptions.
  - Filter by status (`pending`, `in_progress`, `completed`).
  - Filter by priority (`low`, `medium`, `high`, `urgent`).
  - Filter by category (`Work`, `Personal`, `Health`, `Finance`, `Learning`, `Other`).
  - Sort by Created Date, Due Date, Priority, or Title (Ascending/Descending).
- **Responsive Dashboard & Analytics**:
  - Live finish rate metrics, urgent task alerts, and completion progress bars.
- **Dual Database Strategy**:
  - Direct connection to **PostgreSQL** or **Supabase**.
  - Automatic fallback to persistent memory store for zero-dependency local previews out of the box.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# App runs at http://localhost:3000
```

---

## 🐋 Docker & Docker Compose Deployment

Run the complete multi-container stack (Next.js app + PostgreSQL database container):

```bash
# Build & start containers in detached mode
docker-compose up -d --build

# View container status
docker-compose ps
```

The database schema (`prisma/schema.sql`) automatically initializes on container startup!

---

## ⚡ Vercel Deployment

1. Push your repository to GitHub / GitLab.
2. Connect your repo in Vercel.
3. Add Environment Variables under Project Settings:
   - `POSTGRES_URL` or `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.

---

## 🛠️ REST API Endpoints

- `GET /api/tasks` - List tasks with search, filter, and sorting query parameters.
- `POST /api/tasks` - Create a new task.
- `GET /api/tasks/:id` - Fetch single task details.
- `PATCH /api/tasks/:id` - Update task parameters or status.
- `DELETE /api/tasks/:id` - Delete task.
- `POST /api/tasks/seed` - Populate initial sample tasks.
