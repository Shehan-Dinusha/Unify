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

// Dummy middlewares - these should be replaced with actual ones if they exist elsewhere
const authenticateToken = (req, res, next) => {
  // Mock admin context for now
  req.admin = { id: 1, role: 'admin' };
  next();
};

import { validateRequest } from "../middlewares/expressValidator.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/stats/dashboard", getDashboardStatistics);
router.get("/", getAllSuspendedUsers);
router.get("/:userId", getSuspendedUserById);
router.post("/:userId/reactivate", reactivateUserSchema, validateRequest, reactivateUser);
router.post("/", createSuspensionSchema, validateRequest, createSuspension);

export default router;
