import { User } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

/**
 * @desc    Get public followers of a target user
 * @route   GET /api/v1/followers/:userId/followers
 * @access  Public (Protected to logged-in users)
 */
export const getPublicFollowers = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit, 10) || 20;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = (page - 1) * limit;

  const targetUser = await User.findByPk(userId);

  if (!targetUser) {
    return sendResponse(res, 404, false, "User not found.");
  }

  // Only clubs can have followers
  if (targetUser.role?.toLowerCase() !== "club") {
    return sendResponse(res, 403, false, "Only clubs can have followers.");
  }

  const totalFollowers = await targetUser.countFollowers();

  const followers = await targetUser.getFollowers({
    attributes: ["id", "name", "avatar", "role"],
    joinTableAttributes: [],
    limit,
    offset,
  });

  const hasMore = offset + followers.length < totalFollowers;

  const mappedFollowers = await Promise.all(
    followers.map(async (user) => {
      const avatarUrl = await resolveAvatarUrl(user.avatar, user.name);
      return {
        id: user.id,
        name: user.name,
        avatar: avatarUrl,
        role: user.role,
      };
    })
  );

  return sendResponse(res, 200, true, "Followers retrieved successfully.", {
    followers: mappedFollowers,
    total: totalFollowers,
    hasMore,
  });
});

/**
 * @desc    Get public followings of a target user
 * @route   GET /api/v1/followers/:userId/followings
 * @access  Public (Protected to logged-in users)
 */
export const getPublicFollowing = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit, 10) || 20;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = (page - 1) * limit;

  const targetUser = await User.findByPk(userId);

  if (!targetUser) {
    return sendResponse(res, 404, false, "User not found.");
  }

  // Only students can follow other accounts.
  if (targetUser.role?.toLowerCase() !== "student") {
    return sendResponse(res, 403, false, "Only students can follow other accounts.");
  }

  const totalFollowing = await targetUser.countFollowing();

  const following = await targetUser.getFollowing({
    attributes: ["id", "name", "avatar", "role"],
    joinTableAttributes: [],
    limit,
    offset,
  });

  const hasMore = offset + following.length < totalFollowing;

  const mappedFollowing = await Promise.all(
    following.map(async (user) => {
      const avatarUrl = await resolveAvatarUrl(user.avatar, user.name);
      return {
        id: user.id,
        name: user.name,
        avatar: avatarUrl,
        role: user.role,
      };
    })
  );

  return sendResponse(res, 200, true, "Following retrieved successfully.", {
    following: mappedFollowing,
    total: totalFollowing,
    hasMore,
  });
});
