import UserSuspensionService from "../../services/userSuspension.service.js";

export const getAllSuspendedUsers = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      reason: req.query.reason,
      dateRange: req.query.dateRange,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    };

    const data = await UserSuspensionService.getAllSuspendedUsers(filters);

    res.status(200).json({
      success: true,
      message: "Suspended users retrieved successfully",
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
