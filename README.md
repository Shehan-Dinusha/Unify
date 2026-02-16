# Unify

Welcome to the **Unify** project! This repository contains the source code for the Unify application, featuring a Node.js/Express backend and a React/Tailwind frontend.

## 📂 Project Structure

The project is divided into two main directories:

- **`backend/`**: Contains the Node.js/Express server, API, and database logic.
- **`frontend/`**: Contains the React application and UI components.

### Backend Structure (`/backend`)

```
backend/
├── src/
│   ├── config/         # Database and environment configuration
│   ├── middlewares/    # Custom middleware (auth, error handling, validation)
│   ├── modules/        # Feature-based modules (controllers, models, routes, services)
│   ├── routes/         # Main API route definitions
│   ├── services/       # Shared business logic and services
│   ├── utils/          # Utility functions and helpers
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables (do not commit)
├── .env.example        # Example environment variables
└── docker-compose.yml  # Docker services configuration
```

### Frontend Structure (`/frontend`)

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── layout/     # Layout components (Header, Footer, Sidebar)
│   │   └── ui/         # Generic UI elements (Buttons, Inputs, Modals)
│   ├── features/       # Feature-specific components and logic (Auth, Dashboard)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components (routed views)
│   ├── routes/         # Routing configuration
│   ├── services/       # API integration services
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
└── index.html          # HTML template
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher (or use Docker)
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
    # Update .env with your database credentials (DB_NAME=unify)
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    cp .env.example .env
    ```

### Running the Application

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
The application uses Sequelize for ORM. Migrations can be run if configured.

## 📝 Code Rules & Standards

### General
- **Commits**: Use descriptive commit messages (e.g., `feat: add login page`, `fix: resolve db connection issue`).
- **Formatting**: Use Prettier and ESLint (if configured) to maintain consistent code style.

### Backend
- **Modules**: Organize code by feature modules (e.g., `modules/auth`, `modules/products`) containing their own controllers, services, and routes.
- **Environment**: Always use environment variables for sensitive data.
- **Async/Await**: Use `async/await` for asynchronous operations.

### Frontend
- **Components**: Use functional components with hooks.
- **Styling**: Use Tailwind CSS for styling. Avoid inline styles where possible.
- **State Management**: Use React Context or external libraries (like Redux/Zustand) for global state if needed.

## 🐳 Docker Support

You can run the entire stack using Docker Compose.

```bash
# In the root directory (or backend, depending on location)
docker-compose up --build
```

---

**Happy Coding! 🚀**
