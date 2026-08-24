import { User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import { resolveAvatar } from "./utils.js";
import { Op } from "sequelize";
import logger from "../../utils/logger.js";

/**
 * @desc    Search users for starting new chats
 * @route   GET /api/v1/chat/search-users
 * @access  Private (Student, Club)
 */
export const searchChatUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return sendResponse(res, 200, true, "Search results", []);
    }

    const users = await User.findAll({
      where: {
        id: { [Op.ne]: userId },
        role: ["Student", "Club"],
        status: "Active",
        name: { [Op.iLike]: `%${q.trim()}%` },
      },
      attributes: ["id", "name", "avatar", "role", "isOnline"],
      limit: 20,
      order: [["name", "ASC"]],
    });

    const result = await Promise.all(
      users.map(async (user) => ({
        id: user.id,
        name: user.name,
        avatar: await resolveAvatar(user.avatar),
        role: user.role,
        isOnline: user.isOnline,
      })),
    );

    return sendResponse(res, 200, true, "Search results", result);
  } catch (error) {
    logger.error("searchChatUsers error:", error);
    return sendResponse(res, 500, false, "Failed to search users");
  }
};
