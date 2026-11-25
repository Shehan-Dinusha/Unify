# 🎓 Unify

**Unify** is a campus and university life platform that connects students, batch representatives, clubs, and local businesses in one place — from academic resource sharing and social networking to a multi-vendor marketplace, lost & found, real-time chat, and a full admin moderation system.

It ships as a responsive web app that can also be **installed as a Progressive Web App (PWA)** on mobile and desktop.

🌐 Production: [unify-social.app](https://unify-social.app)

---

## 🛠️ Technology Stack

### Backend

| Area            | Tools                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| Runtime         | Node.js 22, Express 4 (ES Modules)                                     |
| Database        | PostgreSQL 15 (Docker locally, RDS in production)                      |
| ORM             | Sequelize 6 — **migrations only**, no auto-sync                        |
| Auth & security | JWT access + refresh tokens, bcryptjs, helmet, cors, express-rate-limit |
| Real-time       | Socket.IO (chat, notifications)                                        |
| Background jobs | node-cron (OTP cleanup, deleted-conversation purge)                    |
| Media           | Multer + AWS S3 (presigned URLs), sharp image optimisation             |
| Payments        | Stripe (checkout, webhooks, Connect for payouts)                       |
| Messaging       | AWS SES / nodemailer (email), Twilio (SMS/OTP)                         |
| Validation      | express-validator                                                      |
| Logging         | winston, morgan                                                        |
| Testing         | Node.js built-in test runner (`node:test`)                             |

### Frontend

| Area          | Tools                                       |
| ------------- | ------------------------------------------- |
| Framework     | React 18 + Vite 5                           |
| Styling       | Tailwind CSS, clsx + tailwind-merge         |
| Routing       | React Router v6 (`createBrowserRouter`)     |
| Data fetching | Axios (with automatic token refresh)        |
| Real-time     | socket.io-client                            |
| Maps          | Google Maps (`@react-google-maps/api`)      |
| UI extras     | Framer Motion, Lucide React, emoji-picker-react |
| PWA           | vite-plugin-pwa (Workbox)                   |

### Infrastructure

Docker, nginx (static frontend + reverse proxy for the API), Let's Encrypt via certbot, GitHub Actions → GHCR → AWS Lightsail.

---

## ✨ Key Features

### 👥 Accounts, Profiles & Verification

- **Multi-role system**: Students, Batch Representatives, Business Owners, Club Owners, and Admins.
- **Account switching**: link multiple accounts on one device and switch between them.
- **Verification**: document submission for clubs and batch representatives, reviewed through an admin verification queue.
- **OTP flows** via email and SMS for registration and password reset.

### 🏪 Digital Marketplace

- **Listing types**: Products, Services, Boarding, Food Cafés, and Club products.
- **Orders & bookings**: order management, event bookings, and booking details.
- **Wallet & payouts**: digital wallet, revenue overview, and withdrawal requests for businesses and clubs.
- **Stripe** checkout and webhooks for secure payments.

### 📚 Academic & Learning Hub

- Dashboards tailored for students and batch representatives.
- Course materials organised by University → Faculty → Degree → Batch → Semester → Module.

### 💬 Social & Communication

- **Newsfeed** with normal posts, event announcements, and marketplace items; likes, comments, and saved posts.
- **Followers** directory and following lists.
- **Real-time chat** with encrypted message storage and configurable retention for deleted conversations.
- **Notifications** delivered in real time.
- **Global search** across users, posts, and listings.

### 🔍 Lost & Found

- Report lost or found items and track your own submissions.
- **Smart matching** (TF-IDF based) suggests likely matches between lost and found posts.
- **Claim requests** to verify ownership before an item is handed over.

### ⭐ Reviews & Reputation

- Ratings and optional reviews for users, clubs, and businesses.
- Received reviews, personal review history, and a reputation score.

### 🚀 Boost System

- Purchase boost packages to promote posts.
- Boost analytics: impressions, interactions, and campaign performance.

### 🛡️ Moderation & Administration

- Admin dashboard with platform metrics and activity logs.
- Student and business management.
- Reporting system for content and users.
- Suspensions with history and reactivation requests.

### 📱 Progressive Web App

- Installable on Android, iOS, and desktop.
- App shell is precached for fast repeat loads; S3 images are cached on the device.
- Offline status banner and in-app update prompt.

---

## 📂 Project Structure

```
Unify/
├── backend/                     # Express API
│   ├── src/
│   │   ├── config/              # Database & environment configuration
│   │   ├── controllers/         # Request handlers grouped by feature
│   │   ├── jobs/                # node-cron background jobs
│   │   ├── middlewares/         # Auth, RBAC, error handling, validation, uploads
│   │   ├── migrations/          # Sequelize migrations (source of truth for schema)
│   │   ├── modules/             # Sequelize models (*.model.js) + associations (index.js)
│   │   ├── routes/              # Express routers, mounted under /api/v1
│   │   ├── seeders/             # Seed data (academic structure, etc.)
│   │   ├── services/            # Business logic & integrations (S3, Stripe, SES, Twilio…)
│   │   ├── socket/              # Socket.IO setup and chat handler
│   │   ├── utils/               # Helpers
│   │   ├── validators/          # express-validator schemas
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # HTTP + Socket.IO entry point
│   ├── tests/                   # node:test suites (unit, validators, helpers)
│   ├── .env.example
│   └── Dockerfile
├── frontend/                    # React + Vite SPA / PWA
│   ├── public/                  # Static assets, icons, PWA icons
│   ├── src/
│   │   ├── components/          # Reusable UI, grouped by feature (common, layout, chat, feed…)
│   │   ├── context/             # React context providers (chat, notifications, boosts…)
│   │   ├── hooks/               # Custom hooks (chat socket, optimistic updates…)
│   │   ├── pages/               # Route-level views
│   │   ├── routes/              # Route definitions split by role
│   │   ├── services/            # Axios API clients
│   │   ├── utils/               # Formatters, validation helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js           # Vite + PWA configuration
├── .github/workflows/deploy.yml # CI/CD pipeline
├── docker-compose.yml           # Local development stack
├── docker-compose.lightsail.yml # Production stack
├── deploy.lightsail.sh          # Production deploy script (runs on the server)
├── Dockerfile                   # Production image: frontend build + nginx
├── nginx.conf                   # nginx config (SPA + API reverse proxy + TLS)
└── .env.example                 # Production environment template
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22 (LTS)
- Docker & Docker Compose
- Optional for full functionality: AWS (S3, SES), Stripe, Twilio, and Google Maps API keys

### Quick Start (local)

```bash
# 1. Start PostgreSQL only (exposed on localhost:5434)
docker compose up -d postgres

# 2. Backend
cd backend
cp .env.example .env    # set DB_HOST=localhost, DB_PORT=5434, DB_SSL=false
npm install
npm run migrate         # create tables from migrations
npm run seed            # insert seed data (academic structure)
npm run dev             # http://localhost:5000

# 3. Frontend (separate terminal)
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev             # http://localhost:5173
```

> Running `docker compose up -d` without a service name starts the **whole stack** in containers: Postgres (:5434), backend (:5000), and the Vite dev server (**:3000**).

### Environment Variables

**Backend** (`backend/.env`, see `backend/.env.example`):

| Group     | Variables                                                                                     |
| --------- | --------------------------------------------------------------------------------------------- |
| Server    | `PORT`, `NODE_ENV`, `FRONTEND_URL`, `CORS_ORIGIN`                                             |
| Database  | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`                           |
| JWT       | `JWT_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`         |
| Email     | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `EMAIL_FROM`                      |
| S3        | `BUCKET_NAME`, `BUCKET_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_ACCESS_KEY`                       |
| Stripe    | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONNECTED_WEBHOOK_SECRET` |
| SMS       | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`                              |
| Chat      | `CHAT_ENCRYPTION_KEY` (64-char hex), `CONVERSATION_RETENTION_DAYS` (default 30)              |

**Frontend** (`frontend/.env`, build-time):

| Variable                   | Purpose                                         |
| -------------------------- | ----------------------------------------------- |
| `VITE_API_URL`             | API base URL, e.g. `http://localhost:5000/api/v1` |
| `VITE_GOOGLE_MAPS_API_KEY` | Maps JavaScript API + Geocoding API key         |

The root `.env.example` is the **production** template used on the Lightsail server.

### Commands

Run from the package root (`backend/` or `frontend/`).

| Package  | Command                    | What                                |
| -------- | -------------------------- | ----------------------------------- |
| backend  | `npm run dev`              | nodemon auto-restart                |
| backend  | `npm start`                | run without nodemon                 |
| backend  | `npm run lint`             | eslint `src/`                       |
| backend  | `npm test`                 | run all tests (`node:test`)         |
| backend  | `npm run test:validators`  | validator tests only                |
| backend  | `npm run test:services`    | service unit tests only             |
| backend  | `npm run test:controllers` | controller unit tests only          |
| backend  | `npm run migrate`          | apply migrations                    |
| backend  | `npm run migrate:undo`     | revert the last migration           |
| backend  | `npm run seed`             | run all seeders                     |
| backend  | `npm run seed:undo`        | revert all seeders                  |
| frontend | `npm run dev`              | Vite dev server                     |
| frontend | `npm run build`            | production build (+ service worker) |
| frontend | `npm run preview`          | serve the production build locally  |
| frontend | `npm run lint`             | eslint — `--max-warnings 0`         |

---

## 🛠️ Architecture & Conventions

### Database (migrations only)

- There is **no** auto-sync — never use `sequelize.sync({ alter: true })`.
- After pulling model changes, run `npm run migrate`.
- For a fresh database: `npm run migrate && npm run seed`.
- Every model change needs a matching migration in `backend/src/migrations/`.

### Testing

- Uses Node's built-in runner (`node:test` + `node:assert/strict`) — no Jest.
- Tests live in `backend/tests/` (`unit/`, `validators/`, `helpers/`) and are named `*.test.js`.
- CI runs `npm run lint` and the full test suite on every PR to `dev` and `main`.

### Conventions

- **ESM everywhere**: both packages use `"type": "module"` — use `import`/`export`, never `require`.
- **API prefix**: all routes are under `/api/v1` (e.g. `/api/v1/auth`). Auth routes have a stricter rate limit.
- **Stripe webhooks**: raw bodies are captured for `/api/v1/payments/webhook` before JSON parsing.
- **Styling**: Tailwind CSS only; merge classes with `clsx` + `tailwind-merge`.
- **Aliases**: frontend imports use `@/` → `src/`.
- **Routes by role**: frontend routes are split into `public`, `auth`, `student`, `business`, and `admin` files under `src/routes/`.

### PWA

- Configured in `frontend/vite.config.js` via `vite-plugin-pwa`; the service worker is generated only by `npm run build` (use `npm run preview` to test it).
- The app shell is precached; S3 images use a cache-first strategy.
- **Authenticated API responses are never cached** by the service worker. Runtime caches that may hold user media are cleared on logout (`src/utils/pwaCache.js`); the app-shell precache is kept.
- When a new version is deployed, users see an "Update available" prompt instead of a silent reload.
- Routes are lazy-loaded (`src/utils/lazyWithRetry.js`), which keeps the main bundle small and the precache well under Workbox's 2 MB per-file limit. A stale chunk after a deploy triggers one automatic reload.
- nginx serves `sw.js`, `manifest.webmanifest` and `index.html` with `Cache-Control: no-cache`, and hashed `/assets/*` as immutable.

---

## ☁️ Deployment (AWS Lightsail)

The CI/CD pipeline (`.github/workflows/deploy.yml`):

1. **On PRs to `dev`/`main`**: lint and test the backend.
2. **On push to `main`**: build two Docker images and push them to GHCR:
   - `unify-backend` — the Express API
   - `unify-server` — the built frontend served by nginx (which also reverse-proxies the API)
3. Copy `docker-compose.lightsail.yml` and `deploy.lightsail.sh` to the server and run the deploy script, which pulls the prebuilt images and restarts the stack.

In production, nginx serves `unify-social.app` (frontend) and `api.unify-social.app` (API + WebSockets) over HTTPS. Certificates are issued and renewed by the `certbot` container.

### Required GitHub secrets

| Secret                     | Purpose                                                |
| -------------------------- | ------------------------------------------------------ |
| `EC2_HOST`                 | Lightsail instance public host/IP                      |
| `EC2_SSH_KEY`              | Private SSH key for the `ubuntu` user                  |
| `GHCR_USERNAME`            | GitHub user (or machine user) with GHCR access         |
| `GHCR_PUSH_TOKEN`          | Token with `write:packages` + `read:packages` (CI push) |
| `GHCR_PULL_TOKEN`          | Read-only `read:packages` token (server pull)          |
| `VITE_API_URL`             | Frontend build-time API base URL                       |
| `VITE_GOOGLE_MAPS_API_KEY` | Frontend build-time Google Maps key                    |

The server also needs a `.env` file next to `docker-compose.lightsail.yml` (based on the root `.env.example`).

---

**Happy Coding! 🚀**
