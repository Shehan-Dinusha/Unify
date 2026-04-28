import UserSuspensionService from "../../services/userSuspension.service.js";

export const createSuspension = async (req, res, next) => {
  try {
    const adminId = req.admin?.id || 1;

    const data = await UserSuspensionService.createSuspension(req.body, adminId);

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
