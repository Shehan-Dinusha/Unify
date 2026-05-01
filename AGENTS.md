# AGENTS.md — Unify

## Project Overview

Campus/university life management platform. Two-package monorepo:

- **Backend** (`/backend`) — Express.js + Sequelize (ESM), PostgreSQL
- **Frontend** (`/frontend`) — React 18 + Vite + Tailwind CSS

## Developer Commands

```
# Backend
cd backend && npm run dev          # nodemon on :5000
cd backend && npm run lint         # eslint src
cd backend && npm run migrate      # sequelize db:migrate
cd backend && npm run migrate:undo # rollback last migration
cd backend && npm run seed         # db:seed:all
cd backend && node --test tests/*.test.js   # run tests (no npm script!)

# Frontend
cd frontend && npm run dev         # vite on :5173
cd frontend && npm run build       # production build
cd frontend && npm run lint        # eslint .

# Docker (root)
docker-compose up -d               # postgres :5434, backend :5000, frontend :5173
```

## Setup Notes

- **DB port is 5434** (non-standard, avoids conflicts with local PostgreSQL 5432). When running backend outside Docker, `DB_HOST=localhost` and `DB_PORT=5434`. Inside Docker, `DB_HOST=postgres` and `DB_PORT=5432`.
- **DB name is `Unify`** (capital U).
- Copy `.env.example` to `.env` in both `backend/` and `frontend/` before running.
- Root `package.json` is minimal and should NOT be used — install deps in each package directory.

## Architecture

### Backend entry and startup flow

1. `backend/src/server.js` — imports models via `modules/index.js`, authenticates DB, syncs schema, starts HTTP server
2. `backend/src/app.js` — Express app with middleware chain, mounts all routes at `/api/v1`
3. `backend/src/modules/index.js` — central model registry and association definitions (45 models). Import this once; all associations are defined here.

### DB sync strategy

- **Non-production**: `sequelize.sync({ alter: true })` — auto-adds columns/tables on startup
- **Production**: auto-sync disabled; use migrations (`npm run migrate`)
- Migrations use `sequelize-cli` directly (no `.sequelizerc` file)

### API route registry

All routes registered in `backend/src/routes/index.js` under `/api/v1`:
- `/verifications`, `/posts`, `/orders`, `/bookings`, `/payments`, `/reviews`, `/followers`, `/reports`, `/boosts`, `/base`, `/lost-and-found`
- `/admin/suspended-users`, `/admin/students`, `/admin/businesses`, `/admin/tools`
- `/learning`

### Frontend routing

Routes organized by role in `frontend/src/routes/index.jsx`:
- `authRoutes.jsx`, `publicRoutes.jsx`, `studentRoutes.jsx`, `businessRoutes.jsx`, `adminRoutes.jsx`

### Stripe webhook

The JSON body parser in `app.js` captures `req.rawBody` for URLs starting with `/api/v1/payments/webhook`. Do not change this verify logic without updating Stripe webhook handling.

## Testing

- Uses Node.js built-in `node:test` runner (zero test dependencies).
- Tests are **unit tests only** — controller logic is extracted into pure functions to avoid needing a DB connection.
- No `npm test` script exists. Run: `cd backend && node --test tests/*.test.js`

## Conventions

- **ESM everywhere** — both packages use `"type": "module"`. Use `import`/`export`, never `require`.
- Backend uses `.js` extension in all imports (required for ESM with Node).
- Frontend uses `clsx` + `tailwind-merge` for conditional className composition.
- Backend response helper: `sendResponse(res, status, success, message)` from `utils/response.js`.

## Gotchas

- `uploads/` directory serves static files locally as fallback before S3 migration is complete.
- `logs/` directory is gitignored; Winston writes there.
- No CI pipeline configured.
- `moment` is used in tests but not listed in `backend/package.json` — may need `npm install moment --save-dev` if running tests fails.
