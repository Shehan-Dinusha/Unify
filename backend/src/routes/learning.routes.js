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
  getSemesterVisibility,
  updateSemesterVisibility,
  getStudentCourseStructure,
  getBatchRepCourseStructure,
} from "../controllers/learning/index.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import { uploadToS3 } from "../middlewares/s3Upload.middleware.js";
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
  getSemesterVisibilityValidator,
  updateSemesterVisibilityValidator,
  getStudentCourseStructureValidator,
  getBatchRepCourseStructureValidator,
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
  uploadToS3({
    type: "single",
    fieldName: "materialFile",
    folder: "learning_materials",
  }),
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

router.get("/batch-reps", getBatchRepsValidator, validateRequest, getBatchReps);

router.get(
  "/student/course-structure",
  getStudentCourseStructureValidator,
  validateRequest,
  getStudentCourseStructure,
);

router.get(
  "/batch-rep/course-structure",
  getBatchRepCourseStructureValidator,
  validateRequest,
  getBatchRepCourseStructure,
);

router.get(
  "/semester-visibility",
  getSemesterVisibilityValidator,
  validateRequest,
  getSemesterVisibility,
);

router.put(
  "/semester-visibility/:degreeId/:semesterId",
  updateSemesterVisibilityValidator,
  validateRequest,
  updateSemesterVisibility,
);

export default router;
