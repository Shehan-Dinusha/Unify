import ClubProfile from "../modules/ClubProfile.model.js";
import { sendResponse } from "../utils/response.js";

export const requireClubVerification = async (req, res, next) => {
  try {
    if (req.user.role !== "Club") return next();

    const clubProfile = await ClubProfile.findOne({
      where: { userId: req.user.id },
      attributes: ["isVerified"],
    });

    if (!clubProfile || !clubProfile.isVerified) {
      return sendResponse(
        res,
        403,
        false,
        "Club account must be verified before accessing this feature. Please submit your verification documents.",
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
