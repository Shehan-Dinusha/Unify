import { StudentProfile, User, AdminLog } from '../modules/index.js';
import logger from '../utils/logger.js';

/**
 * Updates a student's reputation score based on a specific event.
 * @param {number} userId - The ID of the student
 * @param {string} actionType - The type of action
 */
export const updateStudentReputation = async (userId, actionType) => {
  try {
    const profile = await StudentProfile.findOne({ where: { userId } });
    if (!profile) return;

    const POINT_MAP = {
      'FOUND_ITEM_RETURNED': 50,
      'REPORT_RESOLVED': 20,
      'MATERIAL_UPLOADED': 30,
      'MATERIAL_DOWNLOAD': 5,
      'RELIABLE_BUYER_FEEDBACK': 15,
      'VIOLATION_DELETED': -50,
      'FAKE_REPORT_SPAM': -20
    };

    const points = POINT_MAP[actionType] || 0;
    if (points === 0) return;

    const oldScore = profile.reputationScore;
    
    // Update score (ensuring it doesn't drop below 0)
    profile.reputationScore = Math.max(0, profile.reputationScore + points);
    await profile.save();

    logger.info(`Reputation Updated: User ${userId} | ${actionType} | ${oldScore} -> ${profile.reputationScore}`);

    // System Auto-Suspension Logic
    if (profile.reputationScore <= 0) {
      const user = await User.findByPk(userId);
      if (user && user.status !== 'Suspended') {
        user.status = 'Suspended';
        await user.save();
        
        await AdminLog.create({
          adminId: 1, // Using Admin ID 1 for System actions
          type: 'user_suspended',
          title: 'System Auto-Suspension',
          description: 'Reputation score reached 0 due to penalties.',
          targetUserId: userId,
          severity: 'High'
        });
        
        logger.warn(`SYSTEM ACTION: User ${userId} was automatically suspended due to reputation reaching 0.`);
      }
    }

    return profile.reputationScore;
  } catch (error) {
    logger.error(`Failed to update reputation for user ${userId}: ${error.message}`);
  }
};
