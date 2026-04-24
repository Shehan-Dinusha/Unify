import express from "express";
import {
  createModule,
  getModuleDetails,
  editModuleDetails,
  deleteModule,
  createModuleCategory,
  updateModuleCategory,
  getModuleCategories,
  deleteModuleCategory,
} from "../controllers/learning/index.js";

const router = express.Router();

router.post("/modules", createModule);
router.get("/modules/:id", getModuleDetails);
router.put("/modules/:id", editModuleDetails);
router.delete("/modules/:id", deleteModule);

router.post("/modules/:moduleId/categories", createModuleCategory);
router.get("/modules/:moduleId/categories", getModuleCategories);
router.put("/categories/:categoryId", updateModuleCategory);
router.delete("/categories/:categoryId", deleteModuleCategory);

export default router;
