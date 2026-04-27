import { BusinessProfile } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

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
      verificationDocument,
    } = req.body;

    let profile = await BusinessProfile.findOne({ where: { userId } });

    const finalOwnerFirstName = ownerFirstName || firstName;
    const finalOwnerLastName = ownerLastName || lastName;

    const profileData = {
      userId,
      displayName: displayName || businessName || cafeName || clubName || (finalOwnerFirstName ? `${finalOwnerFirstName} ${finalOwnerLastName || ""}`.trim() : null),
      businessName: businessName || cafeName || clubName || (finalOwnerFirstName ? `${finalOwnerFirstName} ${finalOwnerLastName || ""}`.trim() : null),
      category,
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
      verificationDocument,
    };

    // Update User's name if provided
    if (finalOwnerFirstName && finalOwnerLastName) {
      await req.user.update({ name: `${finalOwnerFirstName} ${finalOwnerLastName}` });
    } else if (displayName || businessName) {
      await req.user.update({ name: displayName || businessName });
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
    });

    if (!profile) {
      return sendResponse(res, 404, false, "Business profile not found");
    }

    return sendResponse(res, 200, true, "Business profile fetched successfully", profile);
  } catch (error) {
    logger.error("Get My Business Profile Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch business profile", error.message);
  }
};
