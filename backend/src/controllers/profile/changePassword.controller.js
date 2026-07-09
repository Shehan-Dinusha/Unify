import bcrypt from "bcryptjs";
import { User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Change user password
 * @route   PUT /api/v1/profiles/password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Fetch user with passwordHash
    const user = await User.findByPk(userId);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return sendResponse(res, 400, false, "Incorrect current password");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({ passwordHash });

    logger.info(`Password updated for user ${userId}`);
    return sendResponse(res, 200, true, "Password updated successfully");
  } catch (error) {
    logger.error("Change Password Error:", error);
    return sendResponse(res, 500, false, "Failed to change password", error.message);
  }
};
