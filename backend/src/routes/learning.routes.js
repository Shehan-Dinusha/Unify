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
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import {
  createModuleValidator,
  getModuleDetailsValidator,
  editModuleDetailsValidator,
  deleteModuleValidator,
  createModuleCategoryValidator,
  getModuleCategoriesValidator,
  updateModuleCategoryValidator,
  deleteModuleCategoryValidator,
} from "../validators/learning.validator.js";

const router = express.Router();

router.post("/modules", createModuleValidator, validateRequest, createModule);
router.get(
  "/modules/:id",
  getModuleDetailsValidator,
  validateRequest,
  getModuleDetails,
);
router.put(
  "/modules/:id",
  editModuleDetailsValidator,
  validateRequest,
  editModuleDetails,
);
router.delete(
  "/modules/:id",
  deleteModuleValidator,
  validateRequest,
  deleteModule,
);

router.post(
  "/modules/:moduleId/categories",
  createModuleCategoryValidator,
  validateRequest,
  createModuleCategory,
);
router.get(
  "/modules/:moduleId/categories",
  getModuleCategoriesValidator,
  validateRequest,
  getModuleCategories,
);
router.put(
  "/categories/:categoryId",
  updateModuleCategoryValidator,
  validateRequest,
  updateModuleCategory,
);
router.delete(
  "/categories/:categoryId",
  deleteModuleCategoryValidator,
  validateRequest,
  deleteModuleCategory,
);

export default router;
