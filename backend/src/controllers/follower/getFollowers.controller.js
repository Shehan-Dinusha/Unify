import { User } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";

export const getClubFollowers = catchAsync(async (req, res) => {
  // Use `req.user?.id` normally, but allow `req.query.clubId` for testing since auth is pending
  const clubId = req.user?.id || req.query.clubId;

  if (!clubId) {
    return sendResponse(
      res,
      401,
      false,
      "Not authorized. No club ID provided.",
    );
  }

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
  const mappedFollowers = followers.map((user) => ({
    id: user.id,
    name: user.name,
    avatar:
      user.avatar ||
      "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name),
    role: user.role,
  }));

  // Match the shape expected by the frontend: { followers, total, hasMore }
  return sendResponse(res, 200, true, "Followers retrieved successfully.", {
    followers: mappedFollowers,
    total: totalFollowers,
    hasMore,
  });
});
