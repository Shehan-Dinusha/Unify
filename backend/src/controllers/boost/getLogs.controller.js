import BoostLog from "../../modules/BoostLog.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Retrieves all boost configuration logs for the admin panel.
 * Formats the time into the exact string the frontend expects:
 * "Just now • 4:12 PM, Oct 24"
 */
export const getLogs = async (req, res, next) => {
  try {
    const logs = await BoostLog.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50 // Keep the list manageable
    });

    // Format the data to match frontend mock exactly
    const formattedLogs = logs.map(log => {
      const date = new Date(log.createdAt);
      
      // Calculate relative time (e.g., "Just now" or "2 hours ago")
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMins / 60);
      const diffDays = Math.round(diffHours / 24);

      let relativeTime = '';
      if (diffMins < 5) relativeTime = 'Just now';
      else if (diffMins < 60) relativeTime = `${diffMins} minutes ago`;
      else if (diffHours < 24) relativeTime = `${diffHours} hours ago`;
      else if (diffDays === 1) relativeTime = 'Yesterday';
      else relativeTime = `${diffDays} days ago`;

      // Format absolute time (e.g., "4:12 PM, Oct 24")
      const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Combine for the frontend display
      const displayTime = `${relativeTime} • ${timeStr}, ${dateStr}`;

      return {
        id: log.id,
        type: log.type,
        title: log.title,
        description: log.description,
        time: displayTime,
      };
    });

    return sendResponse(res, 200, true, 'Boost logs retrieved successfully', { logs: formattedLogs });
  } catch (error) {
    logger.error(`Error in getLogs controller: ${error.message}`);
    next(error);
  }
};
