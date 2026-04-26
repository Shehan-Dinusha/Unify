import UserSuspensionService from "../../services/userSuspension.service.js";

export const getSuspendedUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        timestamp: new Date().toISOString()
      });
    }

    const data = await UserSuspensionService.getSuspendedUserById(parseInt(userId));

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
