import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";

//Returns DB-driven stats for the admin boost dashboard tiles.
export const getAdminStats = async (req, res, next) => {
  try {
    const stats = await boostService.getAdminStats();
    return sendResponse(res, 200, true, "Admin stats retrieved.", { stats });
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, error.message);
  }
};
