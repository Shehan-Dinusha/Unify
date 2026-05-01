import UserSuspensionService from "../../services/userSuspension.service.js";

export const reactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const adminId = req.admin?.id || 1;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Identifier is required",
        timestamp: new Date().toISOString()
      });
    }

    const data = await UserSuspensionService.reactivateUser(userId, req.body, adminId);

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
