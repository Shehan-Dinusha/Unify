import express from "express";
import uploadService from "../services/upload.service.js"; // Standard configured multer instance
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import {
  createLostFoundItemValidator,
  getLostFoundItemsQueryValidator,
  getLostFoundItemDetailsValidator,
  editLostFoundItemValidator,     
  deleteLostFoundItemValidator  
} from "../validators/lostAndFound.validator.js";
import {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  editItem,
  deleteItem
} from "../controllers/lostAndFound/index.js";

const router = express.Router();

// 1. Create a new Item (uses multipart/form-data for image)
router.post(
  "/",
  uploadService.array("images", 5), // extracts req.file & req.body
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

// 5. Edit an item
router.put(
  "/:id",
  uploadService.array("images", 5), // Allows updating the images too
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

export default router;
