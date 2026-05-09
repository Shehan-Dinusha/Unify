import Joi from "joi";

/**
 * Boost Package & Purchase validators.
 * Following the same Joi validation pattern as suspension.validator.js.
 */

export const createPackageSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Package name is required.",
    "string.max": "Package name cannot exceed 100 characters.",
    "any.required": "Package name is required.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "Price is required.",
  }),
  durationValue: Joi.number().integer().positive().required().messages({
    "number.base": "Duration value must be a number.",
    "number.integer": "Duration value must be an integer.",
    "number.positive": "Duration value must be positive.",
    "any.required": "Duration value is required.",
  }),
  durationUnit: Joi.string()
    .valid("Hours", "Days", "Weeks")
    .required()
    .messages({
      "any.only": "Duration unit must be one of: Hours, Days, Weeks.",
      "any.required": "Duration unit is required.",
    }),
  description: Joi.string().max(500).allow("", null).optional(),
  badge: Joi.string()
    .valid("No Badge", "Most Popular", "Premium", "Best Value")
    .allow("", null)
    .optional(),
  features: Joi.array().items(Joi.string()).allow(null).optional(),
  boostConfig: Joi.object({
    feedPriority: Joi.number().integer().min(1).max(10).optional(),
    visibilityMultiplier: Joi.number().integer().min(1).max(5).optional(),
    highlightStyle: Joi.string().valid("none", "subtle", "blue", "gold").optional(),
    crossCategoryReach: Joi.boolean().optional(),
    analyticsAccess: Joi.boolean().optional(),
    autoRefreshHours: Joi.number().integer().valid(0, 6, 12, 24).optional(),
  }).allow(null).optional(),
});

export const updatePackageSchema = Joi.object({
  name: Joi.string().trim().max(100).optional(),
  price: Joi.number().positive().optional(),
  durationValue: Joi.number().integer().positive().optional(),
  durationUnit: Joi.string().valid("Hours", "Days", "Weeks").optional(),
  description: Joi.string().max(500).allow("", null).optional(),
  badge: Joi.string()
    .valid("No Badge", "Most Popular", "Premium", "Best Value")
    .allow("", null)
    .optional(),
  features: Joi.array().items(Joi.string()).allow(null).optional(),
  boostConfig: Joi.object({
    feedPriority: Joi.number().integer().min(1).max(10).optional(),
    visibilityMultiplier: Joi.number().integer().min(1).max(5).optional(),
    highlightStyle: Joi.string().valid("none", "subtle", "blue", "gold").optional(),
    crossCategoryReach: Joi.boolean().optional(),
    analyticsAccess: Joi.boolean().optional(),
    autoRefreshHours: Joi.number().integer().valid(0, 6, 12, 24).optional(),
  }).allow(null).optional(),
});

export const purchaseBoostSchema = Joi.object({
  packageId: Joi.string().required().messages({
    "string.empty": "Package ID is required.",
    "any.required": "Package ID is required.",
  }),
  postId: Joi.number().integer().allow(null).optional().messages({
    "number.base": "Post ID must be a number.",
  }),
});

export const logsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  type: Joi.string()
    .valid("package_added", "package_updated", "package_deleted")
    .optional(),
});
