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
} from "../controllers/suspension/suspension.validator.js";

// Dummy middlewares - these should be replaced with actual ones if they exist elsewhere
const authenticateToken = (req, res, next) => {
  // Mock admin context for now
  req.admin = { id: 1, role: 'admin' };
  next();
};

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
};

const router = express.Router();

router.use(authenticateToken);

router.get("/stats/dashboard", getDashboardStatistics);
router.get("/:userId", getSuspendedUserById);
router.post("/:userId/reactivate", validateRequest(reactivateUserSchema), reactivateUser);
router.get("/", getAllSuspendedUsers);
router.post("/", validateRequest(createSuspensionSchema), createSuspension);

export default router;
