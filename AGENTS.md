# Unify — AGENTS.md

## Repo structure

Two-package monorepo: `backend/` (Express + Sequelize) and `frontend/` (React + Vite). Both use ESM (`"type": "module"`). Root `package.json` is just a convenience holder — all work happens in the subdirectories.

## Essential commands

Run **everything** from the subdirectory (`backend/` or `frontend/`).

| Package | Command | Purpose |
|---|---|---|
| backend | `npm run dev` | nodemon auto-restart on `src/server.js` |
| backend | `npm run lint` | eslint `src/` |
| backend | `npm run migrate` | sequelize-cli db:migrate (uses `.sequelizerc.cjs`) |
| backend | `npm run seed` | sequelize-cli db:seed:all |
| backend | `node --test tests/` | run tests (Node built-in `node:test`, **no npm script**) |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Vite production build |
| frontend | `npm run lint` | eslint with `--max-warnings 0` |

## Database

- **PostgreSQL via Docker**: `docker compose up -d` maps host port **5434** → container 5432
- **Migrations-only** — never use `sync({ alter: true })`. After pulling model changes: `npm run migrate`
- Fresh DB: `npm run migrate && npm run seed`
- Sequelize config: `backend/src/config/sequelizeConfig.js`
- All models + associations registered in `backend/src/modules/index.js` (imported once in `server.js`)

## Backend architecture

- Entry: `backend/src/server.js` — authenticates DB, starts OTP cleanup cron, creates HTTP server, attaches Socket.IO
- All API routes under `/api/v1` prefix (set in `backend/src/app.js`)
- Route registration: `backend/src/routes/index.js` mounts ~25 route files
- Controllers grouped by domain in `backend/src/controllers/` (subdirectories per feature)
- Middleware: auth JWT check, rate limiting, S3 upload, express-validator
- Socket.IO chat: `backend/src/socket/`
- Stripe webhook raw body captured via `req.rawBody` when `req.originalUrl` starts with `/api/v1/payments/webhook`
- Background jobs (cron): `backend/src/jobs/`

## Frontend architecture

- Entry: `frontend/src/main.jsx` → `App.jsx` → `frontend/src/routes/index.jsx` (createBrowserRouter)
- `@/` alias → `src/` (configured in `vite.config.js`)
- Services in `frontend/src/services/` — each wraps Axios calls against `VITE_API_URL` (defaults to `http://localhost:5000/api/v1`)
- Axios interceptor in `api.js` handles token injection, auto-refresh on 401, and GET cache-busting headers
- Styling: Tailwind only, merged via `clsx` + `tailwind-merge`

## Testing

- Uses **Node.js built-in test runner**: `node:test` + `node:assert/strict`
- Test files in `backend/tests/` (not next to source)
- Validator tests live in `backend/tests/validators/` — test express-validator schemas in isolation using mock req objects
- Run: `node --test tests/` from `backend/`

## Gotchas

- `.sequelizerc.cjs` is **CommonJS** (required by sequelize-cli even though the project is ESM)
- Stripe webhook needs `express.json({ verify })` to capture raw body — only for the webhook path
- Frontend `eslint` is strict: `--max-warnings 0` (zero warnings policy)
- Env vars: copy `backend/.env.example` → `.env`, set `DB_HOST=localhost`, `DB_PORT=5434` for local dev
- Docker volumes use bind mounts + anonymous node_modules volume (to avoid overwriting container's modules)
