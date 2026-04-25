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
  uploadMaterial,
  editMaterial,
  deleteMaterial,
  getMaterialsByCategory,
  getBatchReps,
} from "../controllers/learning/index.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import uploadService from "../services/upload.service.js";
import {
  createModuleValidator,
  getModuleDetailsValidator,
  editModuleDetailsValidator,
  deleteModuleValidator,
  createModuleCategoryValidator,
  getModuleCategoriesValidator,
  updateModuleCategoryValidator,
  deleteModuleCategoryValidator,
  uploadMaterialValidator,
  editMaterialValidator,
  deleteMaterialValidator,
  getMaterialsByCategoryValidator,
  getBatchRepsValidator,
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

router.post(
  "/modules/:moduleId/materials",
  uploadService.single("materialFile"),
  uploadMaterialValidator,
  validateRequest,
  uploadMaterial,
);

router.put(
  "/materials/:materialId",
  editMaterialValidator,
  validateRequest,
  editMaterial,
);

router.delete(
  "/materials/:materialId",
  deleteMaterialValidator,
  validateRequest,
  deleteMaterial,
);

router.get(
  "/modules/:moduleId/categories/:categoryId/materials",
  getMaterialsByCategoryValidator,
  validateRequest,
  getMaterialsByCategory,
);

router.get(
  "/batch-reps",
  getBatchRepsValidator,
  validateRequest,
  getBatchReps,
);

export default router;
