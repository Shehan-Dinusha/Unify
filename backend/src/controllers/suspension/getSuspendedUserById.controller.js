import UserSuspensionService from "../../services/userSuspension.service.js";

export const getSuspendedUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Identifier is required",
        timestamp: new Date().toISOString()
      });
    }

    const data = await UserSuspensionService.getSuspendedUserById(userId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Suspended user record not found",
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: "Suspended user retrieved successfully",
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
