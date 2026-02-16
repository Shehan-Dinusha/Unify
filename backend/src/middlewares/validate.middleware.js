
import { sendResponse } from '../utils/response.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return sendResponse(res, 400, false, errorMessage);
  }
  next();
};
