import { ClubProfile, User, VerificationRequest } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { getFileUrl } from "../../services/s3.service.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

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
    } = req.body;

    let profile = await ClubProfile.findOne({ where: { userId } });

    const profileData = {
      userId,
      clubName,
      about,
      email,
      logo,
      coverImage,
    };

    const uploadedFile = req.files?.avatar?.[0] || req.files?.profileImage?.[0];
    if (uploadedFile) {
      const avatarKey = uploadedFile.location; // S3 Key
      await req.user.update({ avatar: avatarKey });
      profileData.logo = avatarKey;
      logger.info(`Logo/Avatar updated for club ${userId} in S3: ${avatarKey}`);
    }

    // Handle optional Club Document for Verification
    const clubDoc = req.files?.clubDoc?.[0];
    if (clubDoc) {
      const documentUrl = clubDoc.location; // S3 Key
      const documentMetadata = {
        originalName: clubDoc.originalname,
        mimeType: clubDoc.mimetype,
        size: clubDoc.size,
      };

      // Create VerificationRequest if it doesn't already exist for this user
      const [verification, created] = await VerificationRequest.findOrCreate({
        where: { userId },
        defaults: {
          requestedRole: "Club",
          documentUrl,
          documentMetadata,
          status: "PENDING",
        },
      });

      if (created) {
        logger.info(`VerificationRequest automatically created for club ${userId}`);
      } else {
        // If one exists, we just update the document (Optional design choice)
        await verification.update({ documentUrl, documentMetadata, status: "PENDING" });
        logger.info(`VerificationRequest updated with new document for club ${userId}`);
      }
    }

    if (profile) {
      await profile.update(profileData);
      logger.info(`Club profile updated for user ${userId}`);
    } else {
      profile = await ClubProfile.create(profileData);
      logger.info(`Club profile created for user ${userId}`);
    }

    // Sync clubName with the base User table so the name isn't left as the phone number
    if (clubName) {
      await req.user.update({ name: clubName });
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
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "avatar", "role", "createdAt"],
          include: [
            {
              model: VerificationRequest,
              as: "verificationRequest",
              attributes: ["status", "adminMessage"],
            },
          ],
        },
      ],
    });

    if (!profile) {
      return sendResponse(res, 404, false, "Club profile not found");
    }

    // Convert S3 key to presigned URL or UI-Avatar fallback
    const profileJson = profile.toJSON();
    profileJson.logo = await resolveAvatarUrl(profileJson.logo, profileJson.clubName || "Club");
    profileJson.user.avatar = await resolveAvatarUrl(profileJson.user?.avatar, profileJson.user?.name || "User");

    // Surface verification status at top level for easy frontend consumption
    const vReq = profileJson.user?.verificationRequest;
    if (profileJson.isVerified) {
      profileJson.verificationStatus = "APPROVED";
    } else if (vReq) {
      profileJson.verificationStatus = vReq.status === "DECLINED" ? "REJECTED" : vReq.status;
    } else {
      const removedRequest = await VerificationRequest.findOne({
        where: { userId: req.user.id, status: "DECLINED" },
        paranoid: false,
        order: [["deletedAt", "DESC"]],
      });
      if (removedRequest?.deletedAt) {
        profileJson.verificationStatus = "REMOVED";
        profileJson.verificationReason = removedRequest.adminMessage || null;
      } else {
        profileJson.verificationStatus = "NOT_SUBMITTED";
      }
    }
    if (!profileJson.verificationReason) {
      profileJson.verificationReason = vReq?.adminMessage || null;
    }

    return sendResponse(res, 200, true, "Club profile fetched successfully", profileJson);
  } catch (error) {
    logger.error("Get My Club Profile Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch club profile", error.message);
  }
};
