import UserSuspensionService from "../../services/userSuspension.service.js";
import { notifyUser } from "../../services/notification.service.js";

export const reactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required."
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Identifier is required",
        timestamp: new Date().toISOString()
      });
    }

    const data = await UserSuspensionService.reactivateUser(userId, req.body, adminId);

    // ── Notify the reactivated user ────────────────────────────────────
    notifyUser({
      userId: data.userId,
      actorId: adminId,
      type: "General",
      title: "Account Reactivated 🎉",
      content: `Your account (Case: ${data.caseReference}) has been reactivated. You can now access all platform features again. Welcome back!`,
      referenceId: data.userId,
      referenceType: "Reactivation",
      dedupeKey: `admin:reactivate:${data.userId}:${Date.now()}`,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: "Account reactivated successfully",
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
    next(error);
  }
};
