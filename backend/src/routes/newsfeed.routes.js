import express from "express";
import {
  getEventsToday,
  getMarketplaceItemsToday,
  getNewAnnouncements,
} from "../controllers/newsfeed/index.js";

const router = express.Router();

// GET /api/v1/newsfeed/events-today
router.get("/events-today", getEventsToday);

// GET /api/v1/newsfeed/marketplace-items
router.get("/marketplace-items", getMarketplaceItemsToday);

// GET /api/v1/newsfeed/new-announcements
router.get("/new-announcements", getNewAnnouncements);

export default router;
