import { StudentProfile, User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Create or Update student profile
 * @route   PUT /api/v1/profiles/student
 * @access  Private (Student only)
 */
export const upsertStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Helper to find the first non-empty value among multiple possible field names
    const getVal = (...keys) => {
      for (const key of keys) {
        if (req.body[key] && req.body[key].toString().trim() !== "") {
          return req.body[key].toString().trim();
        }
      }
      return null;
    };

    const registrationNumber = getVal("registrationNumber", "regNumber", "reg_number");
    const universityId = req.body.universityId;
    const facultyId = req.body.facultyId;
    const degreeId = req.body.degreeId;
    const batchId = req.body.batchId;
    const firstName = getVal("firstName", "firstname", "first_name");
    const lastName = getVal("lastName", "lastname", "last_name");
    const gender = req.body.gender;
    const dateOfBirth = req.body.dateOfBirth || req.body.dob;
    const addresses = req.body.addresses;
    const isBatchRep = req.body.isBatchRep;

    // Check if profile exists
    let profile = await StudentProfile.findOne({ where: { userId } });

    const profileData = {
      userId,
      registrationNumber,
      universityId,
      facultyId,
      degreeId,
      batchId,
      firstName,
      lastName,
      gender: gender ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase() : null,
      dateOfBirth,
      addresses,
      isBatchRep: isBatchRep || false,
    };

    // Update User's main name field and avatar if provided
    if (firstName && lastName) {
      await req.user.update({ name: `${firstName} ${lastName}` });
    }

    const uploadedFile = req.files?.avatar?.[0] || req.files?.profileImage?.[0];
    if (uploadedFile) {
      const avatarUrl = `/uploads/avatars/${uploadedFile.filename}`;
      await req.user.update({ avatar: avatarUrl });
      logger.info(`Avatar updated for user ${userId}: ${avatarUrl}`);
    }

    if (profile) {
      // Update
      await profile.update(profileData);
      logger.info(`Student profile updated for user ${userId}`);
    } else {
      // Create
      profile = await StudentProfile.create(profileData);
      logger.info(`Student profile created for user ${userId}`);
    }

    return sendResponse(res, 200, true, "Student profile saved successfully", profile);
  } catch (error) {
    logger.error("Upsert Student Profile Error:", error);
    return sendResponse(res, 500, false, "Failed to save student profile", error.message);
  }
};

/**
 * @desc    Get current user's student profile
 * @route   GET /api/v1/profiles/student/me
 * @access  Private (Student only)
 */
export const getMyStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return sendResponse(res, 404, false, "Student profile not found");
    }

    return sendResponse(res, 200, true, "Student profile fetched successfully", profile);
  } catch (error) {
    logger.error("Get My Student Profile Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch student profile", error.message);
  }
};
