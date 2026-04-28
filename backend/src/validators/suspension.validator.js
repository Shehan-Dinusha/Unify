import { body } from "express-validator";

export const createSuspensionSchema = [
  body("userId")
    .notEmpty().withMessage("User ID is required")
    .isInt().withMessage("User ID must be an integer"),
  body("reason")
    .notEmpty().withMessage("Reason is required")
    .isString().withMessage("Reason must be a string"),
  body("reasonTag")
    .notEmpty().withMessage("Reason tag is required")
    .isIn(["ToS Violation", "Payment Failure", "Suspicious Activity", "Harassment"])
    .withMessage("Invalid reason tag"),
  body("severity")
    .notEmpty().withMessage("Severity is required")
    .isIn(["Critical", "High", "Medium", "Low"])
    .withMessage("Invalid severity"),
  body("effectiveDate")
    .notEmpty().withMessage("Effective date is required")
    .isISO8601().withMessage("Invalid effective date"),
  body("adminNotes")
    .optional({ nullable: true, checkFalsy: true })
];

export const reactivateUserSchema = [
  body("identityVerificationComplete")
    .notEmpty().withMessage("Identity verification status is required")
    .isBoolean().withMessage("Identity verification must be a boolean")
    .custom(value => value === true).withMessage("Identity verification must be completed"),
  body("securityAuditPassed")
    .notEmpty().withMessage("Security audit status is required")
    .isBoolean().withMessage("Security audit must be a boolean")
    .custom(value => value === true).withMessage("Security audit must be passed"),
  body("reactivationNotes")
    .optional({ nullable: true, checkFalsy: true })
];
