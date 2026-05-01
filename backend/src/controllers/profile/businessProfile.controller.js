import { BusinessProfile, User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { getFileUrl } from "../../services/s3.service.js";

/**
 * @desc    Create or Update business profile
 * @route   PUT /api/v1/profiles/business
 * @access  Private (Business only)
 */
export const upsertBusinessProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      displayName,
      businessName,
      cafeName,
      clubName,
      category,
      about,
      serviceType,
      addresses,
      ownerFirstName,
      ownerLastName,
      firstName, // Frontend mapping
      lastName, // Frontend mapping
      nic,
      dob,
      gender,
      email,
      phone,
      website,
    } = req.body;

    let profile = await BusinessProfile.findOne({ where: { userId } });

    // Helper to find the first non-empty value among multiple possible field names
    const getVal = (...keys) => {
      for (const key of keys) {
        if (req.body[key] && req.body[key].toString().trim() !== "") {
          return req.body[key].toString().trim();
        }
      }
      return null;
    };

    const finalOwnerFirstName = getVal("ownerFirstName", "firstName", "firstname", "first_name");
    const finalOwnerLastName = getVal("ownerLastName", "lastName", "lastname", "last_name");

    const profileData = {
      userId,
      displayName: displayName || businessName || cafeName || clubName || (finalOwnerFirstName ? `${finalOwnerFirstName} ${finalOwnerLastName || ""}`.trim() : null),
      businessName: businessName || cafeName || clubName || (finalOwnerFirstName ? `${finalOwnerFirstName} ${finalOwnerLastName || ""}`.trim() : null),
      category: category ? category.trim().toUpperCase() : null,
      about,
      serviceType,
      addresses,
      ownerFirstName: finalOwnerFirstName,
      ownerLastName: finalOwnerLastName,
      nic,
      dob,
      gender: gender ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase() : null,
      email,
      phone,
      website,
    };

    // Update User's name if provided
    if (finalOwnerFirstName && finalOwnerLastName) {
      await req.user.update({ name: `${finalOwnerFirstName} ${finalOwnerLastName}` });
    } else if (displayName || businessName) {
      await req.user.update({ name: displayName || businessName });
    }

    const uploadedFile = req.files?.avatar?.[0] || req.files?.profileImage?.[0];
    if (uploadedFile) {
      const avatarKey = uploadedFile.location; // S3 Key
      await req.user.update({ avatar: avatarKey });
      logger.info(`Avatar updated for user ${userId} in S3: ${avatarKey}`);
    }

    if (profile) {
      await profile.update(profileData);
      logger.info(`Business profile updated for user ${userId}`);
    } else {
      profile = await BusinessProfile.create(profileData);
      logger.info(`Business profile created for user ${userId}`);
    }

    return sendResponse(res, 200, true, "Business profile saved successfully", profile);
  } catch (error) {
    logger.error("Upsert Business Profile Error:", error);
    return sendResponse(res, 500, false, "Failed to save business profile", error.message);
  }
};

/**
 * @desc    Get current user's business profile
 * @route   GET /api/v1/profiles/business/me
 * @access  Private (Business only)
 */
export const getMyBusinessProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: "user", attributes: ["name", "email", "avatar", "createdAt"] }],
    });

    if (!profile) {
      return sendResponse(res, 404, false, "Business profile not found");
    }

    // Convert S3 key to presigned URL for the frontend
    const profileJson = profile.toJSON();
    if (profileJson.user?.avatar) {
      profileJson.user.avatar = await getFileUrl(profileJson.user.avatar);
    }

    return sendResponse(res, 200, true, "Business profile fetched successfully", profileJson);
  } catch (error) {
    logger.error("Get My Business Profile Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch business profile", error.message);
  }
};
