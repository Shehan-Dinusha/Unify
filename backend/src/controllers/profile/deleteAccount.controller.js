import bcrypt from "bcryptjs";
import { User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Delete user account (requires password confirmation)
 * @route   DELETE /api/v1/profiles
 * @access  Private
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return sendResponse(res, 400, false, "Password is required to delete your account");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Verify password before proceeding
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Incorrect password");
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
