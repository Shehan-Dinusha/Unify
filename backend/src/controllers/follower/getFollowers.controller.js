import { User } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

export const getClubFollowers = catchAsync(async (req, res) => {
  const clubId = req.user.id;

  const limit = parseInt(req.query.limit, 10) || 14;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = (page - 1) * limit;

  const club = await User.findByPk(clubId);

  if (!club) {
    return sendResponse(res, 404, false, "Club not found.");
  }

  // Ensure only clubs can have their followers retrieved in this context
  if (club.role !== "Club") {
    return sendResponse(
      res,
      403,
      false,
      "Only clubs can have followers listed.",
    );
  }

  // Use Sequelize's automatically generated generated mixin `countFollowers()`
  const totalFollowers = await club.countFollowers();

  // Use `getFollowers()` to fetch paginated follower records
  const followers = await club.getFollowers({
    attributes: ["id", "name", "avatar", "role"],
    joinTableAttributes: [], // Exclude the junction table 'UserFollower' data itself
    limit,
    offset,
  });

  // Calculate if there are more followers to load
  const hasMore = offset + followers.length < totalFollowers;

  // Map followers for frontend consumption
  const mappedFollowers = await Promise.all(
    followers.map(async (user) => {
      const avatarUrl = await resolveAvatarUrl(user.avatar, user.name);

      return {
        id: user.id,
        name: user.name,
        avatar: avatarUrl,
        role: user.role,
      };
    }),
  );

  // Match the shape expected by the frontend: { followers, total, hasMore }
  return sendResponse(res, 200, true, "Followers retrieved successfully.", {
    followers: mappedFollowers,
    total: totalFollowers,
    hasMore,
  });
});
