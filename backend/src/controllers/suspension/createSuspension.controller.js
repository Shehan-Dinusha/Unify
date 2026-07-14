import UserSuspensionService from "../../services/userSuspension.service.js";
import { notifyUser } from "../../services/notification.service.js";

export const createSuspension = async (req, res, next) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required."
      });
    }

    const data = await UserSuspensionService.createSuspension(req.body, adminId);

    // ── Notify the suspended user ──────────────────────────────────────
    notifyUser({
      userId: data.userId,
      actorId: adminId,
      type: "General",
      title: "Account Suspended",
      content: `Your account has been suspended (Case: ${data.caseReference}). Reason: ${data.reason || "Policy violation"}. Please contact support if you have questions.`,
      referenceId: data.userId,
      referenceType: "Suspension",
      dedupeKey: `admin:suspend:${data.userId}:${Date.now()}`,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: "User suspended successfully",
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
