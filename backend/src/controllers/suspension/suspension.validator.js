import Joi from "joi";

export const createSuspensionSchema = Joi.object({
  userId: Joi.number().integer().required().messages({
    "number.base": "User ID must be an integer",
    "any.required": "User ID is required",
  }),
  reason: Joi.string().required().messages({
    "string.empty": "Reason is required",
    "any.required": "Reason is required",
  }),
  reasonTag: Joi.string()
    .valid("ToS Violation", "Payment Failure", "Suspicious Activity", "Harassment")
    .required()
    .messages({
      "any.only": "Invalid reason tag",
      "any.required": "Reason tag is required",
    }),
  severity: Joi.string()
    .valid("Critical", "High", "Medium", "Low")
    .required()
    .messages({
      "any.only": "Invalid severity",
      "any.required": "Severity is required",
    }),
  effectiveDate: Joi.date().iso().required().messages({
    "date.base": "Invalid effective date",
    "date.format": "Invalid effective date",
    "any.required": "Effective date is required",
  }),
  adminNotes: Joi.string().allow(null, "").optional(),
});

export const reactivateUserSchema = Joi.object({
  identityVerificationComplete: Joi.boolean().valid(true).required().messages({
    "any.only": "Identity verification must be completed",
    "any.required": "Identity verification status is required",
  }),
  securityAuditPassed: Joi.boolean().valid(true).required().messages({
    "any.only": "Security audit must be passed",
    "any.required": "Security audit status is required",
  }),
  reactivationNotes: Joi.string().allow(null, "").optional(),
});
