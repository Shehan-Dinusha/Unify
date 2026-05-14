import { User, UserFollower, ClubProfile } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";

export const toggleFollowClub = catchAsync(async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.clubId; // User they want to follow

  // Find the user who wants to follow
  const follower = await User.findByPk(followerId);
  if (!follower) {
    return sendResponse(res, 404, false, "User not found.");
  }

  // Rule: Only students can follow clubs
  if (follower.role?.toLowerCase() !== "student") {
    return sendResponse(res, 403, false, "Only students can follow clubs.");
  }

  // Find the entity they are trying to follow
  const targetUser = await User.findByPk(followingId);
  if (!targetUser) {
    return sendResponse(res, 404, false, "Target club not found.");
  }

  // Rule: Only clubs can be followed
  if (targetUser.role?.toLowerCase() !== "club") {
    return sendResponse(res, 403, false, "You can only follow clubs.");
  }

  // Rule: The target club must be verified to be followed
  const targetProfile = await ClubProfile.findOne({
    where: { userId: targetUser.id },
  });
  if (!targetProfile || !targetProfile.isVerified) {
    return sendResponse(res, 403, false, "You can only follow verified clubs.");
  }

  // Check if the follow relationship already exists
  const existingFollow = await UserFollower.findOne({
    where: {
      followerId: followerId,
      followingId: followingId,
    },
  });

  if (existingFollow) {
    // Already following -> Unfollow
    await existingFollow.destroy();
    return sendResponse(res, 200, true, "Successfully unfollowed the club.");
  } else {
    // Not following -> Follow
    await UserFollower.create({
      followerId: followerId,
      followingId: followingId,
    });
    return sendResponse(res, 201, true, "Successfully followed the club.");
  }
});
