import { body, param } from "express-validator";

export const createReportSchema = [
  body("reportType")
    .notEmpty().withMessage("Report type is required")
    .isIn(["post", "comment", "user"]).withMessage("Invalid report type. Must be post, comment, or user"),
  
  body("category")
    .notEmpty().withMessage("Category is required")
    .isIn(["inappropriate", "spam", "harassment", "misinformation", "other"])
    .withMessage("Invalid category selected"),
  
  body("reportedEntityId")
    .notEmpty().withMessage("The ID of the reported item/user is required"),
  
  body("additionalDetails")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 5000 }).withMessage("Additional details cannot exceed 5000 characters"),
  
  body("evidenceUrl")
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage("Evidence URL must be a valid link")
];

export const updateReportSchema = [
  param("id")
    .notEmpty().withMessage("Report ID is required"),
    
  body("status")
    .optional()
    .isIn(["Pending Review", "In Progress", "Resolved", "Dismissed"])
    .withMessage("Invalid status update"),
    
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High", "Critical"])
    .withMessage("Invalid priority level"),
    
  body("action")
    .optional()
    .isIn(["dismiss", "resolve", "delete_post", "suspend_user", "add_note"])
    .withMessage("Invalid moderation action"),
    
  body("reason")
    .if(body("action").isIn(["dismiss", "suspend_user"]))
    .notEmpty().withMessage("Reason is required for this action")
];

export const withdrawReportSchema = [
  param("id")
    .notEmpty().withMessage("Report ID is required"),
  
  body("reason")
    .notEmpty().withMessage("Withdrawal reason is required")
    .isLength({ min: 5 }).withMessage("Please provide a more detailed reason (at least 5 characters)")
];
