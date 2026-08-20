import { StudentProfile, BusinessProfile, ClubProfile } from "../modules/index.js";

/**
 * Role-to-profile configuration map.
 *
 * Each entry describes:
 *   - model:  the Sequelize model to query
 *   - pick:   which columns to return from the profile row
 */
const ROLE_PROFILE_CONFIG = {
  Student: {
    model: StudentProfile,
    pick: ["isBatchRep"],
  },
  Business: {
    model: BusinessProfile,
    pick: ["category"],
  },
  Club: {
    model: ClubProfile,
    pick: ["stripeAccountId"],
  },
};

/**
 * Check if the role profile database record actually exists for a user.
 *
 * @param {object} user  – A Sequelize User instance (must have `.id` and `.role`).
 * @returns {Promise<boolean>}  – true if an explicit profile record exists in DB, false otherwise.
 */
export const checkUserProfileExists = async (user) => {
  const config = ROLE_PROFILE_CONFIG[user.role];
  if (!config) return true; // Roles without a profile table (e.g. Admin) are complete by default

  const profile = await config.model.findOne({ where: { userId: user.id } });
  return Boolean(profile);
};

/**
 * Load role-specific profile data for a user.
 *
 * @param {object} user  – A Sequelize User instance (must have `.id` and `.role`).
 * @returns {Promise<object>}  – An object containing only the role-relevant
 *   fields (e.g. `{ isBatchRep: true }` for a Student). Returns `{}` when
 *   no matching configuration or profile row exists.
 */
export const getRoleProfileData = async (user) => {
  const config = ROLE_PROFILE_CONFIG[user.role];
  if (!config) return {};

  const profile = await config.model.findOne({ where: { userId: user.id } });
  if (!profile) return {};

  // Return only the fields listed in `pick`
  const data = {};
  for (const field of config.pick) {
    data[field] = profile[field];
  }
  return data;
};
