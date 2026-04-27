import { ClubProfile, User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Create or Update club profile
 * @route   PUT /api/v1/profiles/club
 * @access  Private (Club only)
 */
export const upsertClubProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      clubName,
      about,
      email,
      logo,
      coverImage,
      verificationDocument,
      document, // Frontend alias
    } = req.body;
    
    const finalVerificationDoc = verificationDocument || document;

    let profile = await ClubProfile.findOne({ where: { userId } });

    const profileData = {
      userId,
      clubName,
      about,
      email,
      logo,
      coverImage,
      verificationDocument: finalVerificationDoc,
    };

    const uploadedFile = req.files?.avatar?.[0] || req.files?.profileImage?.[0];
    if (uploadedFile) {
      const avatarUrl = `/uploads/avatars/${uploadedFile.filename}`;
      await req.user.update({ avatar: avatarUrl });
      profileData.logo = avatarUrl; // Update profile logo as well
      logger.info(`Logo/Avatar updated for club ${userId}: ${avatarUrl}`);
    }

    if (profile) {
      await profile.update(profileData);
      logger.info(`Club profile updated for user ${userId}`);
    } else {
      profile = await ClubProfile.create(profileData);
      logger.info(`Club profile created for user ${userId}`);
    }

    return sendResponse(res, 200, true, "Club profile saved successfully", profile);
  } catch (error) {
    logger.error("Upsert Club Profile Error:", error);
    return sendResponse(res, 500, false, "Failed to save club profile", error.message);
  }
};

/**
 * @desc    Get current user's club profile
 * @route   GET /api/v1/profiles/club/me
 * @access  Private (Club only)
 */
export const getMyClubProfile = async (req, res) => {
  try {
    const profile = await ClubProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return sendResponse(res, 404, false, "Club profile not found");
    }

    return sendResponse(res, 200, true, "Club profile fetched successfully", profile);
  } catch (error) {
    logger.error("Get My Club Profile Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch club profile", error.message);
  }
};
