import express from "express";
import uploadService from "../services/upload.service.js"; // Standard configured multer instance
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import {
  createLostFoundItemValidator,
  getLostFoundItemsQueryValidator,
  getLostFoundItemDetailsValidator,
} from "../validators/lostAndFound.validator.js";
import {
  createItem,
  getItems,
  getItemById
} from "../controllers/lostAndFound/index.js";

const router = express.Router();

// 1. Create a new Item (uses multipart/form-data for image)
router.post(
  "/",
  uploadService.single("image"), // extracts req.file & req.body
  createLostFoundItemValidator,
  validateRequest,
  createItem
);

// 2. Fetch all Items for the feed
router.get(
  "/",
  getLostFoundItemsQueryValidator,
  validateRequest,
  getItems
);

// 3. Fetch single item for Detail View Modal
router.get(
  "/:id",
  getLostFoundItemDetailsValidator,
  validateRequest,
  getItemById
);

export default router;
