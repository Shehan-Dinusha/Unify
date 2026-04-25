import { body, param } from "express-validator";

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
