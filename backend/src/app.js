
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { sendResponse } from './utils/response.js';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Logger Middleware
app.use(morgan('dev'));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  sendResponse(res, 200, true, 'Server is healthy');
});

// API Routes
app.use('/api/v1', routes);

// 404 Handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

export default app;
