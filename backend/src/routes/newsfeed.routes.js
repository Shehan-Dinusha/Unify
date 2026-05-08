import express from "express";
import {
  getEventsToday,
  getMarketplaceItemsToday,
  getNewAnnouncements,
} from "../controllers/newsfeed/index.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET /api/v1/newsfeed/events-today
router.get("/events-today", protect, getEventsToday);

// GET /api/v1/newsfeed/marketplace-items
router.get("/marketplace-items", protect, getMarketplaceItemsToday);

// GET /api/v1/newsfeed/new-announcements
router.get("/new-announcements", protect, getNewAnnouncements);

export default router;
