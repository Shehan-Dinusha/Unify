import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.middleware.js';
import { sendResponse } from './utils/response.js';

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// ── Request Logging ───────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  sendResponse(res, 200, true, 'Server is healthy');
});

// ── API Routes ────────────────────────────────────────────────────────────────
// Routes will be wired here as they are developed.
// Example: import userRoutes from './routes/users.js';
//          app.use('/api/v1/users', userRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, _res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error);
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
