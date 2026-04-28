import { body, oneOf } from "express-validator";
import { ROLES } from "../utils/constants.js";

export const registerValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name must be less than 100 characters"),

  // Conditional email validation for Students
  body("email").custom((value, { req }) => {
    if (req.body.role === ROLES.STUDENT) {
      if (!value) {
        throw new Error("Email is required for students");
      }
      if (!value.endsWith("@uom.lk")) {
        throw new Error("Students must use their @uom.lk email address");
      }
    }
    // For other roles, if email is provided, it must be valid
    if (value && !/^\S+@\S+\.\S+$/.test(value)) {
      throw new Error("Invalid email format");
    }
    return true;
  }),

  // Requirement for Business: Email or Phone
  body("role").custom((value, { req }) => {
    if (value === ROLES.BUSINESS) {
      if (!req.body.email && !req.body.phone) {
        throw new Error("Business accounts require either an email or a phone number");
      }
    }
    return true;
  }),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage("Invalid phone number format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage("Password must include uppercase, lowercase, number, and special character"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role specified"),
];

export const verifyOTPValidator = [
  oneOf(
    [
      body("email").isEmail().withMessage("Invalid email format"),
      body("phone").notEmpty().withMessage("Phone number is required"),
    ],
    { message: "Either email or phone number is required" },
  ),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

export const loginValidator = [
  oneOf(
    [
      body("identifier").notEmpty().withMessage("Email or phone number is required"),
      body("email").isEmail(),
      body("phone").notEmpty(),
    ],
    { message: "Email or phone number is required" }
  ),
  body("password").notEmpty().withMessage("Password is required"),
];

export const resendOTPValidator = [
  oneOf(
    [
      body("email").isEmail().withMessage("Invalid email format"),
      body("phone").notEmpty().withMessage("Phone number is required"),
    ],
    { message: "Either email or phone number is required" },
  ),
];

export const forgotPasswordValidator = [
  oneOf(
    [
      body("email").isEmail().withMessage("Invalid email format"),
      body("phone").notEmpty().withMessage("Phone number is required"),
    ],
    { message: "Either a valid email or phone number is required" },
  ),
];

export const verifyResetOTPValidator = [
  oneOf(
    [
      body("email").isEmail().withMessage("Invalid email format"),
      body("phone").notEmpty().withMessage("Phone number is required"),
    ],
    { message: "Either a valid email or phone number is required" },
  ),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

export const resetPasswordValidator = [
  oneOf(
    [
      body("email").isEmail().withMessage("Invalid email format"),
      body("phone").notEmpty().withMessage("Phone number is required"),
    ],
    { message: "Either a valid email or phone number is required" },
  ),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
  body("password")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
