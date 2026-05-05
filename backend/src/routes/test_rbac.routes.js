import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { ROLES } from "../utils/constants.js";
import { sendResponse } from "../utils/response.js";

const router = express.Router();

// Middleware to ensure all routes in this file are protected
router.use(protect);

router.get("/student-test", authorize(ROLES.STUDENT), (req, res) => {
  sendResponse(res, 200, true, "Welcome Student! You have access to this route.");
});

router.get("/business-test", authorize(ROLES.BUSINESS), (req, res) => {
  sendResponse(res, 200, true, "Welcome Business Owner! You have access to this route.");
});

router.get("/club-test", authorize(ROLES.CLUB), (req, res) => {
  sendResponse(res, 200, true, "Welcome Club Admin! You have access to this route.");
});

router.get("/admin-test", authorize(ROLES.ADMIN), (req, res) => {
  sendResponse(res, 200, true, "Welcome Admin! You have access to this route.");
});

export default router;
