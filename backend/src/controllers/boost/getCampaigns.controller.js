import { Op } from 'sequelize';
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

//Retrieves campaigns for the logged-in business user with filters and pagination.
export const getCampaigns = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, false, "Authentication required.");
    }

    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { userId };

    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Search by campaign name, postTitle, or campaignId
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { postTitle: { [Op.iLike]: `%${search}%` } },
        { campaignId: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await BoostCampaign.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    const pagination = {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    };

    return sendResponse(res, 200, true, 'Campaigns retrieved successfully', {
      campaigns: rows,
      pagination,
    });
  } catch (error) {
    logger.error(`Error in getCampaigns controller: ${error.message}`);
    next(error);
  }
};
