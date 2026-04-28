import { body, param, query } from "express-validator";

export const toggleFollowValidator = [
  param("clubId")
    .notEmpty()
    .withMessage("Club ID is required")
    .isInt()
    .withMessage("Club ID must be an integer"),
  body("followerId")
    .optional()
    .isInt()
    .withMessage("Follower ID must be an integer"),
];

export const getFollowersValidator = [
  query("clubId")
    .optional()
    .isInt()
    .withMessage("Club ID must be an integer"),
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
  query("studentId")
    .optional()
    .isInt()
    .withMessage("Student ID must be an integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];
