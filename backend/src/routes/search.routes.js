import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { searchProfiles } from "../controllers/search/searchProfiles.controller.js";

const router = Router();

router.get("/profiles", protect, authorize("Student", "Club"), searchProfiles);

export default router;
