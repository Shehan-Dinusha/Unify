/**
 * getClaims.controller.js
 *
 * Route:  GET /api/v1/lost-and-found/:id/claims
 *
 * Returns every claim / "I found this" request submitted for an item,
 * including the claimant's contact number and message.
 *
 * Access control: ONLY the item owner can view claims, because the response
 * contains other students' contact numbers.
 */

import { LostAndFound, ClaimRequest, User } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import { formatRelativeDate } from "../../utils/date.js";

export const getClaims = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const item = await LostAndFound.findByPk(id, { attributes: ["id", "userId"] });

  if (!item) {
    return sendResponse(res, 404, false, "Item not found.");
  }

  if (item.userId !== userId) {
    return sendResponse(res, 403, false, "You do not have permission to view claims for this item.");
  }

  const claims = await ClaimRequest.findAll({
    where: { itemId: id },
    include: [{ model: User, as: "claimant", attributes: ["id", "name", "avatar"] }],
    order: [["createdAt", "DESC"]],
  });

  const formatted = claims.map((claim) => ({
    id: claim.id,
    contactNumber: claim.contactNumber,
    description: claim.description,
    status: claim.status,
    time: formatRelativeDate(claim.createdAt),
    createdAt: claim.createdAt,
    claimant: {
      id: claim.claimant?.id ?? claim.claimantId,
      name: claim.claimant?.name || "Unknown",
      avatar: claim.claimant?.avatar || null,
    },
  }));

  return sendResponse(res, 200, true, "Claims fetched successfully.", formatted);
});

