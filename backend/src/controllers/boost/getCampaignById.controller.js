import { Op } from 'sequelize';
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import BoostPackage from "../../modules/BoostPackage.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

//Retrieves a single campaign detail by ID.
export const getCampaignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, false, "Authentication required.");
    }

    const isNumeric = !isNaN(id) && !isNaN(parseFloat(id));
    const campaign = await BoostCampaign.findOne({
      where: {
        [Op.or]: [
          isNumeric ? { id: parseInt(id, 10) } : null,
          { campaignId: id }
        ].filter(Boolean)
      },
      include: [
        {
          model: BoostPackage,
          as: 'package',
          attributes: ['id', 'name', 'price', 'durationValue', 'durationUnit', 'badge', 'features'],
        },
      ],
    });

    if (!campaign) {
      return sendResponse(res, 404, false, 'Campaign not found');
    }

    // Business users can only view their own campaigns
    if (campaign.userId !== userId) {
      return sendResponse(res, 404, false, 'Campaign not found or unauthorized');
    }

    return sendResponse(res, 200, true, 'Campaign details retrieved', campaign);
  } catch (error) {
    logger.error(`Error in getCampaignById controller: ${error.message}`);
    next(error);
  }
};
