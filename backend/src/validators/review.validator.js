import { body, param } from "express-validator";

export const submitReviewValidator = [
  body("targetId")
    .notEmpty()
    .withMessage("Target ID is required")
    .isInt()
    .withMessage("Target ID must be an integer"),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review")
    .optional()
    .isString()
    .withMessage("Review content must be a string")
    .isLength({ max: 500 })
    .withMessage("Review content cannot exceed 500 characters"),
  body("isAnonymous")
    .optional()
    .isBoolean()
    .withMessage("isAnonymous must be a boolean"),
  body("reviewerId")
    .optional()
    .isInt()
    .withMessage("Reviewer ID must be an integer"),
];

export const deleteReviewValidator = [
  param("id")
    .notEmpty()
    .withMessage("Review ID is required")
    .isInt()
    .withMessage("Review ID must be an integer"),
];

export const getTargetReviewsValidator = [
  param("targetId")
    .notEmpty()
    .withMessage("Target ID is required")
    .isInt()
    .withMessage("Target ID must be an integer"),
];

export const toggleReviewFeedbackValidator = [
  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .isInt()
    .withMessage("Review ID must be an integer"),
  body("action")
    .notEmpty()
    .withMessage("Action is required")
    .isIn(["helpful", "not_helpful"])
    .withMessage("Invalid action. Must be 'helpful' or 'not_helpful'"),
];

export const toggleOwnerLikeValidator = [
  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .isInt()
    .withMessage("Review ID must be an integer"),
];

export const replyToReviewValidator = [
  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .isInt()
    .withMessage("Review ID must be an integer"),
  body("content")
    .notEmpty()
    .withMessage("Reply content is required")
    .isString()
    .withMessage("Reply content must be a string"),
];
