import { body, param, query } from "express-validator";

export const createModuleValidator = [
  body("title").notEmpty().withMessage("Module Title is required"),
  body("code").notEmpty().withMessage("Module Code is required"),
  body("semester").notEmpty().withMessage("Semester is required"),
  body("visibility")
    .isArray({ min: 1 })
    .withMessage("At least one visibility degree is required"),
];

export const getModuleDetailsValidator = [
  param("id")
    .notEmpty()
    .withMessage("Module ID is required")
    .isInt()
    .withMessage("Module ID must be an integer"),
];

export const editModuleDetailsValidator = [
  param("id")
    .notEmpty()
    .withMessage("Module ID is required")
    .isInt()
    .withMessage("Module ID must be an integer"),
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Module Title cannot be empty"),
  body("code").optional().notEmpty().withMessage("Module Code cannot be empty"),
  body("visibility")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Visibility must be a non-empty array of degree IDs"),
];

export const deleteModuleValidator = [
  param("id")
    .notEmpty()
    .withMessage("Module ID is required")
    .isInt()
    .withMessage("Module ID must be an integer"),
];

export const createModuleCategoryValidator = [
  param("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .isInt()
    .withMessage("Module ID must be an integer"),
  body("title").notEmpty().withMessage("Category title is required"),
  body("iconName").notEmpty().withMessage("Category icon name is required"),
];

export const getModuleCategoriesValidator = [
  param("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .isInt()
    .withMessage("Module ID must be an integer"),
];

export const updateModuleCategoryValidator = [
  param("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt()
    .withMessage("Category ID must be an integer"),
  body("title").notEmpty().withMessage("Category title is required"),
  body("iconName").notEmpty().withMessage("Category icon name is required"),
];

export const deleteModuleCategoryValidator = [
  param("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt()
    .withMessage("Category ID must be an integer"),
];

export const uploadMaterialValidator = [
  param("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .isInt()
    .withMessage("Module ID must be an integer"),
  body("title").notEmpty().withMessage("Material title is required"),
  body("category")
    .notEmpty()
    .withMessage("A category is required to upload material"),
  body("attachmentType")
    .isIn(["Upload File", "Attach Link"])
    .withMessage(
      "Attachment type must be either 'Upload File' or 'Attach Link'",
    ),
  body("linkUrl")
    .if(body("attachmentType").equals("Attach Link"))
    .notEmpty()
    .withMessage("Link URL is required when attachment type is 'Attach Link'")
    .isURL()
    .withMessage("A valid URL is required"),
];

export const editMaterialValidator = [
  param("materialId")
    .notEmpty()
    .withMessage("Material ID is required")
    .isInt()
    .withMessage("Material ID must be an integer"),
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Material title cannot be empty"),
  body("categoryId")
    .optional()
    .isInt()
    .withMessage("Category ID must be an integer"),
];

export const deleteMaterialValidator = [
  param("materialId")
    .notEmpty()
    .withMessage("Material ID is required")
    .isInt()
    .withMessage("Material ID must be an integer"),
];

export const getMaterialsByCategoryValidator = [
  param("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .isInt()
    .withMessage("Module ID must be an integer"),
  param("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt()
    .withMessage("Category ID must be an integer"),
];

export const getBatchRepsValidator = [
  query("degreeId")
    .notEmpty()
    .withMessage("Degree ID is required")
    .isInt()
    .withMessage("Degree ID must be an integer"),
];

export const getSemesterVisibilityValidator = [
  query("degreeId")
    .notEmpty()
    .withMessage("Degree ID is required")
    .isInt()
    .withMessage("Degree ID must be an integer"),
  query("semesterId")
    .notEmpty()
    .withMessage("Semester ID is required")
    .isInt()
    .withMessage("Semester ID must be an integer"),
];

export const updateSemesterVisibilityValidator = [
  param("degreeId")
    .notEmpty()
    .withMessage("Degree ID is required")
    .isInt()
    .withMessage("Degree ID must be an integer"),
  param("semesterId")
    .notEmpty()
    .withMessage("Semester ID is required")
    .isInt()
    .withMessage("Semester ID must be an integer"),
  body("visibleBatchIds")
    .isArray()
    .withMessage("visibleBatchIds must be an array"),
  body("visibleBatchIds.*")
    .isInt()
    .withMessage("Each item in visibleBatchIds must be an integer"),
  body("notifyStudents")
    .optional()
    .isBoolean()
    .withMessage("notifyStudents must be a boolean"),
];

export const getStudentCourseStructureValidator = [
  // userId now sourced from auth token (req.user.id)
];

export const getBatchRepCourseStructureValidator = [
  query("degreeId")
    .notEmpty()
    .withMessage("Degree ID is required")
    .isInt()
    .withMessage("Degree ID must be an integer"),
];
