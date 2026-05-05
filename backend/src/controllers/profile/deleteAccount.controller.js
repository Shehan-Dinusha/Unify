import { User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/profiles
 * @access  Private
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Perform deletion (cascades to profiles due to onDelete: 'CASCADE' in associations)
    await user.destroy();

    logger.info(`Account deleted for user ${userId}`);
    return sendResponse(res, 200, true, "Account deleted successfully");
  } catch (error) {
    logger.error("Delete Account Error:", error);
    return sendResponse(res, 500, false, "Failed to delete account", error.message);
  }
};
