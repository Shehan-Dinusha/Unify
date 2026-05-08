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
];
