import { param, query } from "express-validator";

export const toggleFollowValidator = [
  param("clubId")
    .notEmpty()
    .withMessage("Club ID is required")
    .isInt()
    .withMessage("Club ID must be an integer"),
];

export const getFollowersValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];

export const getFollowingValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("sortOrder")
    .optional()
    .isIn(["newest", "oldest", "asc", "desc"])
    .withMessage("Sort order must be one of: newest, oldest, asc, desc"),
];

export const getPublicFollowersValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];
