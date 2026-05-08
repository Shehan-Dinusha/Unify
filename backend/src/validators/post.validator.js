import { body, param } from "express-validator";

export const createNormalPostValidator = [
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be a string"),
  body("phone")
    .optional({ checkFalsy: true })
    .isString().withMessage("Phone must be a string"),
  body("postType")
    .notEmpty().withMessage("Post type is required")
    .isIn(["club", "food-cafe", "service"]).withMessage("Invalid post type"),
];

export const createClubProductPostValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Product name is required"),
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required"),
  body("price")
    .notEmpty().withMessage("Price is required")
    .isNumeric().withMessage("Price must be a number"),
  body("category")
    .notEmpty().withMessage("Category is required"),
  body("enableSizes")
    .optional()
    .isBoolean().withMessage("enableSizes must be a boolean"),
];

export const createClubEventPostValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Event name is required"),
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required"),
  body("date")
    .notEmpty().withMessage("Date is required")
    .isISO8601().withMessage("Date must be valid"),
  body("time")
    .notEmpty().withMessage("Time is required"),
  body("location")
    .notEmpty().withMessage("Location is required"),
];

export const createBoardingPostValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required"),
  body("location")
    .trim()
    .notEmpty().withMessage("Location is required"),
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required"),
  body("price")
    .notEmpty().withMessage("Price is required")
    .isNumeric().withMessage("Price must be a number"),
  body("phone")
    .notEmpty().withMessage("Phone is required"),
  body("gender")
    .notEmpty().withMessage("Gender preference is required")
    .isIn(["Male Only", "Female Only", "Any"]).withMessage("Invalid gender preference"),
  body("latitude")
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
  body("longitude")
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),
];

export const postParamsValidator = [
  param("type")
    .notEmpty().withMessage("Post type is required")
    .isIn(["normal", "club-product", "club-event", "boarding", "food-cafe", "service"])
    .withMessage("Invalid post type in parameters"),
  param("id")
    .notEmpty().withMessage("Post ID is required")
    .isInt().withMessage("Post ID must be an integer"),
];

export const commentValidator = [
  body("content")
    .trim()
    .notEmpty().withMessage("Comment content is required")
    .isString().withMessage("Comment content must be a string"),
];
