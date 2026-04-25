import { validationResult } from "express-validator";
import { sendResponse } from "../utils/response.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return sendResponse(res, 400, false, errorMessage);
  }
  next();
};
