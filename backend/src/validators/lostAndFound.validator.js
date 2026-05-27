import { body, param, query } from "express-validator";

export const createLostFoundItemValidator = [
  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["Lost", "Found"]).withMessage("Type must be exactly 'Lost' or 'Found'"),
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be a string"),

  body("location")
    .trim()
    .notEmpty().withMessage("Location is required")
    .isString().withMessage("Location must be a string"),
    
  body("date")
  .notEmpty().withMessage("Date is required")
  .isISO8601().withMessage("Date must be valid"),

  body("timeOfDay")
  .notEmpty().withMessage("Time is required")
  .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/)
  .withMessage("Time must be HH:mm format"),
];

export const getLostFoundItemDetailsValidator = [
  param("id")
    .notEmpty().withMessage("Item ID is required")
    .isInt().withMessage("Item ID must be an integer"),
];

export const getLostFoundItemsQueryValidator = [
  query("type")
    .optional()
    .isIn(["Lost", "Found", "All"]).withMessage("Filter type must be 'Lost', 'Found', or 'All'")
];

export const editLostFoundItemValidator = [
  param("id")
    .notEmpty().withMessage("Item ID is required")
    .isInt().withMessage("Item ID must be an integer"),
  body("title").optional().trim().isString().withMessage("Title must be a string"),
  body("description").optional().trim().isString(),
  body("location").optional().trim().isString(),
  body("status").optional().isIn(["Active", "Resolved"]).withMessage("Invalid status"),
];
export const deleteLostFoundItemValidator = [
  param("id")
    .notEmpty().withMessage("Item ID is required")
    .isInt().withMessage("Item ID must be an integer"),
];

export const claimLostFoundItemValidator = [
  param("id")
    .notEmpty().withMessage("Item ID is required")
    .isInt().withMessage("Item ID must be an integer"),
  body("contactNumber")
    .trim()
    .notEmpty().withMessage("Contact number is required")
    .isLength({ min: 7, max: 15 }).withMessage("Contact number must be between 7 and 15 characters"),
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
];