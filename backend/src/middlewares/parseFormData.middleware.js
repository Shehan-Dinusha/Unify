import logger from "../utils/logger.js";

/**
 * Middleware to parse specific JSON fields in multipart/form-data requests.
 * Fields like 'addresses' are often sent as JSON strings via FormData.
 */
export const parseFormDataFields = (fields = []) => {
  return (req, res, next) => {
    try {
      fields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === "string") {
          try {
            req.body[field] = JSON.parse(req.body[field]);
            // logger.debug(`Parsed FormData field: ${field}`);
          } catch (e) {
            // If it's not valid JSON, leave it as is (might be a simple string)
          }
        }
      });
      next();
    } catch (error) {
      logger.error("Parse FormData Fields Error:", error);
      next();
    }
  };
};
