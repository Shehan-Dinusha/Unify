import { body } from "express-validator";

export const createConversationValidator = [
  body("targetUserId")
    .isInt({ min: 1 })
    .withMessage("Valid user ID is required"),
];
