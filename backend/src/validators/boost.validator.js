import { body, query } from "express-validator";

export const createPackageValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Package name is required.")
    .isLength({ max: 100 }).withMessage("Package name cannot exceed 100 characters."),
  body("price")
    .notEmpty().withMessage("Price is required.")
    .isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
  body("durationValue")
    .notEmpty().withMessage("Duration value is required.")
    .isInt({ min: 1 }).withMessage("Duration value must be a positive integer."),
  body("durationUnit")
    .notEmpty().withMessage("Duration unit is required.")
    .isIn(["Hours", "Days", "Weeks"]).withMessage("Duration unit must be one of: Hours, Days, Weeks."),
  body("description")
    .optional({ values: "null" })
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters."),
  body("badge")
    .optional({ values: "null" })
    .trim()
    .isIn(["No Badge", "Most Popular", "Premium", "Best Value"]).withMessage("Invalid badge."),
  body("features")
    .optional({ values: "null" })
    .custom((value) => {
      if (!Array.isArray(value)) throw new Error("Features must be an array.");
      for (const item of value) {
        if (typeof item !== "string") throw new Error("Each feature must be a string.");
      }
      return true;
    }),
  body("boostConfig")
    .optional({ values: "null" })
    .isObject().withMessage("Boost config must be an object."),
  body("boostConfig.feedPriority")
    .optional().isInt({ min: 1, max: 10 }).toInt(),
  body("boostConfig.visibilityMultiplier")
    .optional().isInt({ min: 1, max: 5 }).toInt(),
  body("boostConfig.highlightStyle")
    .optional().trim()
    .isIn(["none", "subtle", "blue", "gold"]).withMessage("Invalid highlight style."),
  body("boostConfig.crossCategoryReach")
    .optional().isBoolean().toBoolean(),
  body("boostConfig.analyticsAccess")
    .optional().isBoolean().toBoolean(),
  body("boostConfig.autoRefreshHours")
    .optional().isIn([0, 6, 12, 24]).withMessage("Auto-refresh hours must be 0, 6, 12, or 24."),
];

export const updatePackageValidator = [
  body("name")
    .optional().trim()
    .isLength({ max: 100 }).withMessage("Package name cannot exceed 100 characters."),
  body("price")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
  body("durationValue")
    .optional()
    .isInt({ min: 1 }).withMessage("Duration value must be a positive integer."),
  body("durationUnit")
    .optional()
    .isIn(["Hours", "Days", "Weeks"]).withMessage("Duration unit must be one of: Hours, Days, Weeks."),
  body("description")
    .optional({ values: "null" })
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters."),
  body("badge")
    .optional({ values: "null" })
    .trim()
    .isIn(["No Badge", "Most Popular", "Premium", "Best Value"]).withMessage("Invalid badge."),
  body("features")
    .optional({ values: "null" })
    .custom((value) => {
      if (!Array.isArray(value)) throw new Error("Features must be an array.");
      for (const item of value) {
        if (typeof item !== "string") throw new Error("Each feature must be a string.");
      }
      return true;
    }),
  body("boostConfig")
    .optional({ values: "null" })
    .isObject().withMessage("Boost config must be an object."),
  body("boostConfig.feedPriority")
    .optional().isInt({ min: 1, max: 10 }).toInt(),
  body("boostConfig.visibilityMultiplier")
    .optional().isInt({ min: 1, max: 5 }).toInt(),
  body("boostConfig.highlightStyle")
    .optional().trim()
    .isIn(["none", "subtle", "blue", "gold"]).withMessage("Invalid highlight style."),
  body("boostConfig.crossCategoryReach")
    .optional().isBoolean().toBoolean(),
  body("boostConfig.analyticsAccess")
    .optional().isBoolean().toBoolean(),
  body("boostConfig.autoRefreshHours")
    .optional().isIn([0, 6, 12, 24]).withMessage("Auto-refresh hours must be 0, 6, 12, or 24."),
];

export const purchaseBoostValidator = [
  body("packageId")
    .notEmpty().withMessage("Package ID is required."),
  body("postId")
    .optional({ values: "null" })
    .isInt({ min: 1 }).withMessage("Post ID must be a positive integer."),
];

export const logsQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100."),
  query("type")
    .optional()
    .trim()
    .isIn(["package_added", "package_updated", "package_deleted"])
    .withMessage("Invalid log type."),
];
