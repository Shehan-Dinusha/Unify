import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import { sendResponse } from "./utils/response.js";
import path from "path";
import apiRoutes from "./routes/index.js";

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

// ── Request Logging ───────────────────────────────────────────────────────────
app.use(morgan("dev"));

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/api/v1/payments/webhook")) {
        req.rawBody = buf;
      }
    },
  }),
);
app.use(express.urlencoded({ extended: true }));

// ── Root Route ────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  sendResponse(res, 200, true, "Welcome to Unify API");
});

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  sendResponse(res, 200, true, "Server is healthy");
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1", apiRoutes);

// ── Static Files (Temporary prior to S3 migration) ────────────────────────────
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, _res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
