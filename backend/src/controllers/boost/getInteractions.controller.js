import { Op } from 'sequelize';
import BoostInteraction from "../../modules/BoostInteraction.model.js";
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

// Retrieves interactions for a specific campaign with search and pagination.
export const getInteractions = async (req, res, next) => {
  try {
    const { id } = req.params; // campaign id
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Verify campaign exists
    const isNumeric = !isNaN(id) && !isNaN(parseFloat(id));
    const campaign = await BoostCampaign.findOne({
      where: {
        [Op.or]: [
          isNumeric ? { id: parseInt(id, 10) } : null,
          { campaignId: id }
        ].filter(Boolean)
      }
    });
    if (!campaign) {
      return sendResponse(res, 404, false, 'Campaign not found');
    }

    const where = { campaignId: campaign.id };

    // Search by content or action
    if (search) {
      where[Op.or] = [
        { content: { [Op.iLike]: `%${search}%` } },
        { action: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await BoostInteraction.findAndCountAll({
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

    return sendResponse(res, 200, true, 'Interactions retrieved successfully', {
      interactions: rows,
      pagination,
    });
  } catch (error) {
    logger.error(`Error in getInteractions controller: ${error.message}`);
    next(error);
  }
};
