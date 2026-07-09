import express from "express";
import { 
  getAllSuspendedUsers, 
  getSuspendedUserById, 
  getDashboardStatistics, 
  reactivateUser, 
  createSuspension 
} from "../controllers/suspension/index.js";
import { 
  createSuspensionSchema, 
  reactivateUserSchema 
} from "../validators/suspension.validator.js";

import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect, authorize('Admin'));

router.get("/stats/dashboard", getDashboardStatistics);
router.get("/", getAllSuspendedUsers);
router.get("/:userId", getSuspendedUserById);
router.post("/:userId/reactivate", reactivateUserSchema, validateRequest, reactivateUser);
router.post("/", createSuspensionSchema, validateRequest, createSuspension);

export default router;
