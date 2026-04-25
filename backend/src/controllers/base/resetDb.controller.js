import { sequelize } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const resetDb = async (req, res, next) => {
  try {
    await sequelize.sync({ force: true });
    logger.info("All tables dropped and recreated!");
    return sendResponse(
      res,
      200,
      true,
      "All tables dropped and recreated successfully!",
    );
  } catch (error) {
    logger.error("Error resetting database:", error);
    return sendResponse(
      res,
      500,
      false,
      "Failed to reset database",
      error.message,
    );
  }
};
