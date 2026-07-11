import express from "express";
import { uploadToS3 } from "../middlewares/s3Upload.middleware.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import {
  createLostFoundItemValidator,
  getLostFoundItemsQueryValidator,
  getLostFoundItemDetailsValidator,
  editLostFoundItemValidator,     
  deleteLostFoundItemValidator,
  claimLostFoundItemValidator
} from "../validators/lostAndFound.validator.js";
import {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  editItem,
  deleteItem,
  getMatches,
  claimItem
} from "../controllers/lostAndFound/index.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(protect);

// 1. Create a new Item (uses multipart/form-data for image)
router.post(
  "/",
  ...uploadToS3({ type: "array", fieldName: "images", folder: "lost-and-found", maxCount: 5 }),
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

// 3. Fetch ONLY items belonging to the logged-in user
router.get(
  "/my-items", 
  getMyItems
);

// 4. Fetch single item for Detail View Modal
router.get(
  "/:id",
  getLostFoundItemDetailsValidator,
  validateRequest,
  getItemById
);

// 4.5. Fetch matches for a specific item
router.get(
  "/:id/matches",
  getLostFoundItemDetailsValidator,
  validateRequest,
  getMatches
);

// 5. Edit an item
router.put(
  "/:id",
  ...uploadToS3({ type: "array", fieldName: "images", folder: "lost-and-found", maxCount: 5 }),
  editLostFoundItemValidator,
  validateRequest,
  editItem
);
// 6. Delete an item
router.delete(
  "/:id", 
  deleteLostFoundItemValidator, 
  validateRequest, 
  deleteItem
);
// 7. Claim an item
router.post(
  "/:id/claim",
  claimLostFoundItemValidator,
  validateRequest,
  claimItem
);

export default router;
