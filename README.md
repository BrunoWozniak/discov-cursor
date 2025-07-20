# Discov Cursor - Full-Stack Todo Application

A modern, containerized full-stack application with React frontend, Express/PostgreSQL backend, and comprehensive testing suite.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Development Setup
```bash
# Clone and start development environment
git clone <your-repo-url>
cd discov-cursor
docker compose --profile dev up
```

Visit: http://localhost:3000/discov-cursor

### Run All Tests
```bash
docker compose --profile test up
```

---

## 🏗️ Architecture

- **Frontend**: React with modern shadcn/ui components, clean light/dark mode, and Tailwind CSS
- **Backend**: Express.js REST API
- **Database**: PostgreSQL with Knex.js migrations
- **Testing**: Jest (unit), Newman (API), Cypress (E2E)
- **Containerization**: Docker Compose with isolated environments

## 📁 Project Structure

```
discov-cursor/
├── frontend/          # React application
├── backend/           # Express API server
├── db/               # Database initialization
├── scripts/          # Utility scripts
├── .github/          # CI/CD workflows
└── docker-compose.yml
```

## 🧪 Testing Strategy

### Test Profiles
- **Development**: `docker compose --profile dev up`
- **Testing**: `docker compose --profile test up`

### Test Types
1. **Backend Unit Tests**: Jest integration tests
2. **API Contract Tests**: Newman/Postman collection
3. **Frontend Unit Tests**: Jest component tests
4. **E2E Tests**: Cypress browser automation
> **Note:** In E2E tests, form submission is triggered directly (not by clicking the Add button) for maximum reliability in containerized/headless environments.

### Test Isolation
- Each test type runs in isolated containers
- Separate database instances for testing
- Production builds for E2E testing

## 🗄️ Database Management

### Migrations
This project uses Knex.js for database schema management.

**Create a migration:**
```bash
docker compose exec backend npx knex migrate:make your_migration_name
```

**Apply migrations:**
- Automatic on container startup
- No manual commands needed

See [`backend/MIGRATIONS.md`](backend/MIGRATIONS.md) for detailed workflow.

## 🔌 API Documentation

Complete API documentation: [`backend/BACKEND_API_DOC.md`](backend/BACKEND_API_DOC.md)

**Base URL**: `http://localhost:4000` (host) or `http://backend:4000` (container)

**Endpoints**:
- `POST /todos` - Create todo
- `GET /todos` - List all todos
- `GET /todos/:id` - Get single todo
- `PATCH /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## 🚀 Deployment

### Frontend
- **Platform**: GitHub Pages
- **CI/CD**: Automated via GitHub Actions
- **Domain**: Configure in `.github/workflows/ci-cd.yml`

### Backend
- **Platform**: Render (Docker service)
- **Database**: Render managed PostgreSQL
- **Environment**: Set via Render dashboard

### CI/CD Pipeline
- Automated testing on every push
- Test results and coverage reporting
- Artifact uploads for debugging

## 🛠️ Development Workflow

### Code Changes
- Edit files locally (mounted into containers)
- Hot reload for frontend (React)
- Auto-restart for backend (Nodemon)
- No local `npm install` required

### Testing Locally
```bash
# Run specific test types
docker compose up backend-test          # Backend unit tests
docker compose up backend-api-test      # API contract tests
docker compose up frontend-test         # Frontend unit tests
docker compose up frontend-e2e-test     # E2E tests
```

### Database Changes
1. Create migration: `docker compose exec backend npx knex migrate:make name`
2. Edit migration file in `backend/migrations/`
3. Restart containers: `docker compose restart backend`

## 📊 Monitoring & Debugging

### Logs
```bash
# View all logs
docker compose logs

# View specific service
docker compose logs backend
docker compose logs frontend
```

### Test Results
- JUnit XML reports in `test-results/`
- Coverage reports in `coverage/`
- GitHub Actions summary with test results

## 🤝 Contributing

1. Follow the development workflow above
2. Use migrations for all database changes
3. Ensure all tests pass before submitting
4. Update documentation as needed

---

## 📝 License

[Add your license here]

## 🔗 Links

- [Backend API Documentation](backend/BACKEND_API_DOC.md)
- [Database Migrations Guide](backend/MIGRATIONS.md)
- [GitHub Actions Workflow](.github/workflows/ci-cd.yml) 