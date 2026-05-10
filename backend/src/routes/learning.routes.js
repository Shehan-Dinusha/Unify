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
import { protect, authorize, isBatchRep } from "../middlewares/auth.middleware.js";
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

router.post("/modules", protect, authorize("Student"), isBatchRep, createModuleValidator, validateRequest, createModule);
router.get(
  "/modules/:id",
  protect,
  authorize("Student"),
  getModuleDetailsValidator,
  validateRequest,
  getModuleDetails,
);
router.put(
  "/modules/:id",
  protect,
  authorize("Student"), isBatchRep,
  editModuleDetailsValidator,
  validateRequest,
  editModuleDetails,
);
router.delete(
  "/modules/:id",
  protect,
  authorize("Student"), isBatchRep,
  deleteModuleValidator,
  validateRequest,
  deleteModule,
);

router.post(
  "/modules/:moduleId/categories",
  protect,
  authorize("Student"), isBatchRep,
  createModuleCategoryValidator,
  validateRequest,
  createModuleCategory,
);
router.get(
  "/modules/:moduleId/categories",
  protect,
  authorize("Student"),
  getModuleCategoriesValidator,
  validateRequest,
  getModuleCategories,
);
router.put(
  "/categories/:categoryId",
  protect,
  authorize("Student"), isBatchRep,
  updateModuleCategoryValidator,
  validateRequest,
  updateModuleCategory,
);
router.delete(
  "/categories/:categoryId",
  protect,
  authorize("Student"), isBatchRep,
  deleteModuleCategoryValidator,
  validateRequest,
  deleteModuleCategory,
);

router.post(
  "/modules/:moduleId/materials",
  protect,
  authorize("Student"), isBatchRep,
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
  protect,
  authorize("Student"), isBatchRep,
  editMaterialValidator,
  validateRequest,
  editMaterial,
);

router.delete(
  "/materials/:materialId",
  protect,
  authorize("Student"), isBatchRep,
  deleteMaterialValidator,
  validateRequest,
  deleteMaterial,
);

router.get(
  "/modules/:moduleId/categories/:categoryId/materials",
  protect,
  authorize("Student"),
  getMaterialsByCategoryValidator,
  validateRequest,
  getMaterialsByCategory,
);

router.get("/batch-reps", protect, authorize("Student"), getBatchRepsValidator, validateRequest, getBatchReps);

router.get(
  "/student/course-structure",
  protect,
  authorize("Student"),
  getStudentCourseStructureValidator,
  validateRequest,
  getStudentCourseStructure,
);

router.get(
  "/batch-rep/course-structure",
  protect,
  authorize("Student"), isBatchRep,
  getBatchRepCourseStructureValidator,
  validateRequest,
  getBatchRepCourseStructure,
);

router.get(
  "/semester-visibility",
  protect,
  authorize("Student"), isBatchRep,
  getSemesterVisibilityValidator,
  validateRequest,
  getSemesterVisibility,
);

router.put(
  "/semester-visibility/:degreeId/:semesterId",
  protect,
  authorize("Student"), isBatchRep,
  updateSemesterVisibilityValidator,
  validateRequest,
  updateSemesterVisibility,
);

export default router;
