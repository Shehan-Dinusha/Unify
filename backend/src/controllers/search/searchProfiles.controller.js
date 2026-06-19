import { Op } from "sequelize";
import { User, BusinessProfile, ClubProfile } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

export const searchProfiles = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return sendResponse(res, 200, true, "Search results", []);
    }

    const targetRoles =
      req.user.role === "Student"
        ? ["Business", "Club"]
        : ["Business", "Club"];

    const users = await User.findAll({
      where: {
        id: { [Op.ne]: req.user.id },
        role: { [Op.in]: targetRoles },
        status: "Active",
        [Op.or]: [
          { name: { [Op.iLike]: `%${q.trim()}%` } },
          { "$businessProfile.businessName$": { [Op.iLike]: `%${q.trim()}%` } },
          { "$clubProfile.clubName$": { [Op.iLike]: `%${q.trim()}%` } },
        ],
        [Op.and]: {
          [Op.or]: [
            { role: "Business" },
            { "$clubProfile.isVerified$": true },
          ],
        },
      },
      include: [
        { model: BusinessProfile, as: "businessProfile", required: false },
        { model: ClubProfile, as: "clubProfile", required: false },
      ],
      attributes: ["id", "name", "role", "avatar"],
      limit: 20,
      order: [["name", "ASC"]],
    });

    const results = await Promise.all(
      users.map(async (user) => ({
        id: user.id,
        name:
          user.businessProfile?.businessName ||
          user.clubProfile?.clubName ||
          user.name,
        role: user.role,
        category: user.businessProfile?.category || null,
        avatar: await resolveAvatarUrl(user.avatar, user.name),
      })),
    );

    return sendResponse(res, 200, true, "Search results", results);
  } catch (error) {
    logger.error(`Error in searchProfiles: ${error.message}`);
    next(error);
  }
};
