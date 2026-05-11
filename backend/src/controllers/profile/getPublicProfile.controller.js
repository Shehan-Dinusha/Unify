import {
  User,
  StudentProfile,
  BusinessProfile,
  ClubProfile,
  University,
  Faculty,
  Degree,
  Batch,
  UserFollower,
  Review,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

/**
 * @desc    Get a user's public profile based on visibility rules
 * @route   GET /api/v1/profiles/public/:userId
 * @access  Private (Logged in users only, with role-based access control)
 */
export const getPublicProfile = async (req, res) => {
  try {
    const viewerId = req.user.id;
    const viewerRole = req.user.role;
    const targetUserId = req.params.userId;

    // Fetch the target user's basic info to check their role
    const targetUser = await User.findOne({
      where: { id: targetUserId },
      attributes: ["id", "name", "email", "role", "avatar", "createdAt"],
    });

    if (!targetUser) {
      return sendResponse(res, 404, false, "Profile not found");
    }

    const targetRole = targetUser.role;

    // --- Visibility Rules ---
    // 1. Admin bypass
    if (viewerRole !== "Admin") {
      // 2. Student profiles are always private
      if (targetRole === "Student") {
        return sendResponse(res, 403, false, "This profile is not accessible.");
      }

      // 3. Businesses can only view Businesses
      if (viewerRole === "Business" && targetRole !== "Business") {
        return sendResponse(
          res,
          403,
          false,
          "Business accounts can only view other business profiles.",
        );
      }

      // 4. Clubs can only view Clubs
      if (viewerRole === "Club" && targetRole !== "Club") {
        return sendResponse(
          res,
          403,
          false,
          "Club accounts can only view other club profiles.",
        );
      }
    }

    // Get counts
    const followerCount = await targetUser.countFollowers();
    const followingCount = await targetUser.countFollowing();

    // Check if the current user is following the target user
    let isFollowing;
    if (viewerRole?.toLowerCase() === "student" && targetRole?.toLowerCase() === "club") {
      const followRecord = await UserFollower.findOne({
        where: { followerId: viewerId, followingId: targetUserId },
      });
      isFollowing = !!followRecord;
    }

    // Prepare response data based on role
    let profileData = null;
    
    // Calculate review stats for Clubs and Businesses
    let reviewCount = 0;
    let rating = 0;
    
    if (targetRole === "Business" || targetRole === "Club") {
      const reviews = await Review.findAll({ 
        where: { targetId: targetUserId },
        attributes: ['rating']
      });
      
      reviewCount = reviews.length;
      if (reviewCount > 0) {
        const sumRating = reviews.reduce((acc, r) => acc + r.rating, 0);
        rating = Number((sumRating / reviewCount).toFixed(1));
      }
    }
    let mappedProfile = {
      id: targetUser.id,
      name: targetUser.name,
      role: targetRole.toLowerCase() === "admin" ? "student" : targetRole.toLowerCase(),
      profileImage: await resolveAvatarUrl(targetUser.avatar, targetUser.name || "User"),
      createdAt: targetUser.createdAt,
      followerCount,
      followingCount,
      isFollowing,
      reviewCount,
      rating,
    };

    if (targetRole === "Student") {
      const studentProfile = await StudentProfile.findOne({
        where: { userId: targetUserId },
        include: [
          { model: University, as: "university", attributes: ["name"] },
          { model: Faculty, as: "faculty", attributes: ["name"] },
          { model: Degree, as: "degree", attributes: ["name"] },
          { model: Batch, as: "batch", attributes: ["name"] },
        ],
      });

      if (studentProfile) {
        const studentJson = studentProfile.toJSON();
        mappedProfile = {
          ...mappedProfile,
          subtitle: studentJson.batch?.name || "",
          badge: studentJson.degree?.name || "",
          description: studentJson.faculty?.name || "",
          memberSince: new Date(targetUser.createdAt).getFullYear().toString(),
          ...studentJson,
          id: targetUser.id, // Explicitly restore User ID
        };
      }
    } else if (targetRole === "Business") {
      const businessProfile = await BusinessProfile.findOne({
        where: { userId: targetUserId },
      });

      if (businessProfile) {
        const businessJson = businessProfile.toJSON();
        let fRole = "boarding_owner";
        if (businessJson.category) {
           const cat = businessJson.category.toLowerCase();
           if (cat === "boarding") fRole = "boarding_owner";
           else if (cat === "food") fRole = "food_cafe";
           else if (cat === "self_employed") fRole = "self_employed";
        }
        
        mappedProfile = {
          ...mappedProfile,
          name: businessJson.displayName || businessJson.businessName || targetUser.name,
          role: fRole,
          subtitle: businessJson.category === "BOARDING" ? "Registered Boarding Owner" : 
                    businessJson.category === "FOOD" ? "Registered Food Provider" : "Registered Service Provider",
          badge: `Member since ${new Date(targetUser.createdAt).getFullYear()}`,
          description: businessJson.about || "",
          ...businessJson,
          id: targetUser.id, // Explicitly restore User ID
        };
      }
    } else if (targetRole === "Club") {
      const clubProfile = await ClubProfile.findOne({
        where: { userId: targetUserId },
      });

      if (clubProfile) {
        const clubJson = clubProfile.toJSON();
        mappedProfile = {
          ...mappedProfile,
          name: clubJson.clubName || targetUser.name,
          role: "club_society",
          subtitle: "",
          badge: `Member since ${new Date(targetUser.createdAt).getFullYear()}`,
          description: clubJson.about || "",
          profileImage: await resolveAvatarUrl(clubJson.logo || targetUser.avatar, clubJson.clubName || targetUser.name),
          ...clubJson,
          id: targetUser.id, // Explicitly restore User ID
        };
      }
    } else {
       // If admin or other unknown role, just return basic user
    }

    return sendResponse(
      res,
      200,
      true,
      "Public profile fetched successfully",
      mappedProfile
    );
  } catch (error) {
    logger.error("Get Public Profile Error:", error);
    return sendResponse(
      res,
      500,
      false,
      "Failed to fetch public profile",
      error.message
    );
  }
};
