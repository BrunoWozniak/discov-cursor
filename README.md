# Discov Cursor Project

## Overview
This project is a full-stack app with a React frontend and an Express/Postgres backend, fully containerized with Docker Compose. It supports automated database migrations and a robust dev workflow.

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Set Up Environment Variables
- Copy `.env.example` to `.env` in both `frontend/` and `backend/` if you need to override defaults.

### 3. Start the Dev Environment
```bash
docker-compose up --build -d
```
- This will start the frontend, backend, and database containers.
- All dependencies are installed inside the containers (no need for local npm install).

---

## Development Workflow

- **Edit code inside the dev containers:**
  - Your local `frontend/` and `backend/` folders are mounted into the containers.
  - Any changes you make locally are reflected live in the running containers.
  - For backend, `nodemon` restarts the server on code changes.
  - For frontend, React hot reload is enabled.

**Tip:** You do NOT need to run `npm install` locally. All dependencies are managed inside the containers.

---

## Database Migrations

- This project uses [Knex.js](https://knexjs.org/) for schema migrations.
- **Whenever you change the database schema, create a new migration.**
- See [`backend/MIGRATIONS.md`](backend/MIGRATIONS.md) for a step-by-step guide.
- Migrations are applied automatically every time the backend container starts.

---

## Backend API & Postman Collection

- The backend API is documented in [`backend/BACKEND_API_DOC.md`](backend/BACKEND_API_DOC.md).
- You can test the backend endpoints using the provided Postman collection: [`backend/todo-backend.postman_collection.json`](backend/todo-backend.postman_collection.json).

---

## Production/Build & Deployment
- **Frontend:** Deployed to GitHub Pages via CI/CD workflow. Set your custom domain in `.github/workflows/ci-cd.yml` and your repo's Pages settings.
- **Backend:** Deployed to [Render](https://render.com/) as a Docker service. Connect your GitHub repo to Render and follow their dashboard to set up the backend and managed Postgres database. Set environment variables in the Render dashboard (see `.env.example`).
- **Database:** Use Render's managed Postgres add-on. Copy connection details to your backend's environment variables in Render.
- For CI/CD and deployment, see `.github/workflows/ci-cd.yml` and Render's documentation.

---

## Contributing
- Please follow the dev workflow above.
- Use migrations for all DB schema changes.
- Keep documentation up to date. 