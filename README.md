# 🎓 Unify

Welcome to the **Unify** project! Unify is a comprehensive campus and university life management platform designed to connect students, academic representatives, clubs, and local businesses.

Built with a modern full-stack architecture, Unify provides an extensive range of features from academic resource sharing and social networking to a fully-featured digital marketplace and a robust administrative moderation system.

---

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Docker)
- **ORM**: Sequelize (using ES Modules, Migrations-only)
- **Real-time API**: Socket.IO (for chat)
- **Background Jobs**: node-cron
- **Authentication/Security**: bcryptjs, helmet, cors
- **File Uploads**: Multer (configured for S3-based media storage)
- **Validation**: express-validator
- **Logging**: winston, morgan

### Frontend

- **Framework**: React 18 (Bootstrapped with Vite)
- **Styling**: Tailwind CSS & clsx/tailwind-merge
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Data Fetching**: Axios

---

## ✨ Key Features

### 👥 User Profiles & Verification

- **Multi-Role System**: Dedicated profile types for Students, Business Owners, and Club Owners.
- **Verification System**: Secure document submission for Club profiles and Student Batch Representatives. Includes an Admin Verification Queue for approving or rejecting status updates.

### 🏪 Digital Marketplace

- **Multi-Vendor Marketplace**: Supports different listing types including Products, Services, Boarding, and Food Cafes.
- **Financial Operations**: Features a digital wallet, order management, revenue overviews, and withdrawal requests for businesses and clubs.
- **Stripe Integration**: Secure payment processing for marketplace transactions.

### ⭐ Review & Feedback System

- **Robust Ratings**: Leave ratings and optional reviews for users, clubs, and businesses.
- **Review History**: View received reviews and personal review history.

### 📚 Academic & Learning Hub

- **Learning Dashboards**: Tailored views for regular Students and Batch Representatives.
- **Material Management**: Share and organize course materials, categorized by Degrees, Semesters, Faculties, and Modules.

### 💬 Social Networking & Communication

- **Dynamic Newsfeed**: Share normal posts, event announcements, and marketplace items.
- **Follower System**: Follow users and manage followers directories.
- **Real-Time Chat**: Direct messaging capabilities using a dedicated chat system.

### 🛡️ Moderation & Administration

- **Admin Dashboard**: Comprehensive overview of platform metrics and activities.
- **Reporting System**: Submit and moderate reports regarding content or users.
- **Suspension System**: Suspend users for policy violations and manage reactivation requests.

### 🚀 Boost System

- **Content Promotion**: Purchase boost packages to increase the visibility of posts.
- **Boost Analytics**: Track the performance and interactions of active boost campaigns.

### 🔍 Lost and Found

- **Centralized Hub**: Report and discover lost items on campus. Track personal lost and found submissions.

---

## 📂 Project Structure

### Backend (`/backend`)

```
backend/
├── src/
│   ├── config/         # Database and environment configuration
│   ├── controllers/    # Request handlers grouped by feature
│   ├── middlewares/    # Custom middleware (auth, error handling, validation)
│   ├── modules/         # Sequelize models (ESM based) and feature domains
│   ├── routes/         # Express API route definitions
│   ├── services/       # Shared business logic and external service integrations
│   ├── utils/          # Utility functions and helpers
│   ├── validators/     # Express-validator schemas
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env.example        # Example environment variables
└── docker-compose.yml  # Docker services configuration
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/     # Reusable UI components (layout, ui, etc.)
│   ├── pages/          # Full page views mapped to routes (e.g., Dashboards, Profiles)

## ☁️ Production Deployment (AWS Lightsail)

The production CI/CD pipeline builds Docker images in GitHub Actions, pushes them to GHCR, and Lightsail only pulls prebuilt images.

Required GitHub repository secrets:

- `EC2_HOST`: Lightsail instance public host/IP.
- `EC2_SSH_KEY`: Private SSH key for `ubuntu` user.
- `GHCR_USERNAME`: GitHub username (or machine user) that can access GHCR packages.
- `GHCR_PUSH_TOKEN`: Token with `write:packages` + `read:packages` for GitHub Actions image push.
- `GHCR_PULL_TOKEN`: Read-only token with `read:packages` for Lightsail image pull.
- `VITE_API_URL`: Frontend build API base URL.
- `VITE_GOOGLE_MAPS_API_KEY`: Frontend build Google Maps key.

Production deploy uses:

- `docker-compose.lightsail.yml`
- `deploy.lightsail.sh`

│   ├── chat/           # Chat-specific components and logic
│   ├── profile/        # Profile management components
│   ├── App.jsx         # Main React application component
│   └── main.jsx        # Entry point for Vite
└── index.html          # HTML template
```

---

## 🚀 Getting Started

### Quick Start

```bash
# 1. Database (Docker)
docker compose up -d    # PostgreSQL on :5434

# 2. Backend
cd backend
cp .env.example .env    # edit DB_HOST=localhost, DB_PORT=5434
npm install
npm run migrate         # create tables from migrations
npm run seed            # insert seed data (academic structure)
npm run dev             # http://localhost:5000

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev             # http://localhost:5173
```

### Commands

Run all commands from the package root (`backend/` or `frontend/`).

| Package  | Command              | What                             |
| -------- | -------------------- | -------------------------------- |
| backend  | `npm run dev`        | nodemon auto-restart             |
| backend  | `npm run lint`       | eslint `src/`                    |
| backend  | `npm run migrate`    | sequelize-cli db:migrate         |
| backend  | `npm run seed`       | sequelize-cli db:seed:all        |
| backend  | `node --test tests/` | run tests (built-in `node:test`) |
| frontend | `npm run dev`        | Vite dev server                  |
| frontend | `npm run build`      | Vite production build            |
| frontend | `npm run lint`       | eslint — `max-warnings 0`        |

---

## 🛠️ Architecture & Conventions

### Database Setup (Migrations vs Auto-Sync)

- **Migrations-only**: There is no database auto-sync mechanism inside the app (do **never** use `sync({ alter: true })`).
- After pulling model changes, always run: `npm run migrate`.
- For a fresh DB, run: `npm run migrate && npm run seed`.
- The `docker-compose.yml` provides a Postgres container mapping to port `5434` to avoid local conflicts.

### Testing Setup

- Uses **Node.js built-in native test runner** (`node:test` and `node:assert/strict`).
- No Jest, no other heavy test frameworks.
- Tests are executed directly with the node binary: `node --test tests/`. There is no test script declared in `package.json`.

### Key Technical Conventions

- **ESM Everywhere**: Both packages use `"type": "module"`. Always use `import`/`export` instead of `require`.
- **API Prefix**: All backend routes exist under `/api/v1` (e.g., `/api/v1/auth`).
- **Stripe Webhooks**: Webhook raw payloads are captured via a special express middleware mapping effectively configured matching `/api/v1/payments/webhook`.
- **Styling**: Exclusively use Tailwind CSS. Component classes are dynamically merged via `clsx` + `tailwind-merge`.
- **Aliases**: Frontend imports heavily rely on the `@/` alias (which translates to `src/`).

### Project Structure Details

- **Websockets**: `backend/src/socket/` houses Socket.IO initialization and our real-time chat handler.
- **Cron Jobs**: `backend/src/jobs/` contains background workers relying on `node-cron` (like OTP cleanup).
- **Validators**: Input schema validations are performed using `express-validator` stored under `backend/src/validators/`.

---

**Happy Coding! 🚀**
