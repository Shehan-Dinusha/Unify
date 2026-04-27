# 🎓 Unify

Welcome to the **Unify** project! Unify is a comprehensive campus and university life management platform designed to connect students, academic representatives, clubs, and local businesses. 

Built with a modern full-stack architecture, Unify provides an extensive range of features from academic resource sharing and social networking to a fully-featured digital marketplace and a robust administrative moderation system.

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize (using ES Modules)
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
│   ├── chat/           # Chat-specific components and logic
│   ├── profile/        # Profile management components
│   ├── App.jsx         # Main React application component
│   └── main.jsx        # Entry point for Vite
└── index.html          # HTML template
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher (or use Docker)
- **Docker & Docker Compose** (Optional, but recommended for database hosting)
- **npm** or **yarn**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Unify
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Update .env with your database credentials (DB_NAME=unify) and set DB_PORT as needed.
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    cp .env.example .env
    ```

### Running the Application Locally

1.  **Start the Backend:**
    ```bash
    # In /backend
    npm run dev
    ```
    The server will run on `http://localhost:5000`.

2.  **Start the Frontend:**
    ```bash
    # In /frontend
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Database Setup

Ensure you have a PostgreSQL database named `unify` created.
```sql
CREATE DATABASE unify;
```
The application uses Sequelize for ORM with auto-sync configuration (`sync({ alter: true })`).

### Docker Setup

You can run the PostgreSQL database locally using Docker Compose to avoid conflicts with existing local services.

```bash
# In the root or backend directory depending on docker-compose.yml location
docker-compose up -d
```
Make sure `docker-compose.yml` and `.env` are aligned on the correct database port (e.g., 5433 to avoid default Postgres conflicts).

---

## 📝 Code Rules & Standards

### General
- **Commits**: Use descriptive commit messages (e.g., `feat: add login page`, `fix: resolve db connection issue`).
- **Formatting**: Use Prettier and ESLint (configured in both frontend and backend) to maintain consistent code style.

### Backend
- **ES Modules**: Ensure the use of `import`/`export` syntax (`"type": "module"` is configured).
- **Environment Variables**: Always use environment variables for sensitive data, keys, and configurations.
- **Async/Await**: Use `async/await` for asynchronous operations to maintain readability.

### Frontend
- **Components**: Use functional components with hooks. Keep components modular.
- **Styling**: Exclusively use Tailwind CSS for styling. Avoid inline styles where possible. Use `clsx` and `tailwind-merge` for conditional classes.
- **State Management**: Utilize Context API or local state hooks.

---

**Happy Coding! 🚀**
