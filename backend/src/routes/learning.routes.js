import express from "express";
import {
  createModule,
  getModuleDetails,
  editModuleDetails,
  deleteModule,
} from "../controllers/learning/index.js";

const router = express.Router();

router.post("/modules", createModule);
router.get("/modules/:id", getModuleDetails);
router.put("/modules/:id", editModuleDetails);
router.delete("/modules/:id", deleteModule);

export default router;
