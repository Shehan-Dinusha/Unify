import UserSuspensionService from "../../services/userSuspension.service.js";

export const getDashboardStatistics = async (req, res, next) => {
  try {
    const data = await UserSuspensionService.getDashboardStatistics();

    res.status(200).json({
      success: true,
      message: "Suspension statistics retrieved successfully",
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
