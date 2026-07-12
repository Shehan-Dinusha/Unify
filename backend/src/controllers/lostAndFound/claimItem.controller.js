import { LostAndFound, User, ClaimRequest } from "../../modules/index.js";
import { notifyUser } from "../../services/notification.service.js";
import { catchAsync } from "../../utils/response.js";

/**
 * @desc Claim a Lost & Found item
 * @route POST /api/v1/lost-and-found/:id/claim
 * @access Private
 */
export const claimItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { contactNumber, description } = req.body;
  const claimantId = req.user.id;

  // 1. Verify item exists
  const item = await LostAndFound.findByPk(id, {
    include: [{ model: User, as: "user", attributes: ["id", "name"] }],
  });

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found.",
    });
  }

  // 2. Prevent claiming own item
  if (item.userId === claimantId) {
    return res.status(400).json({
      success: false,
      message: "You cannot claim an item you posted.",
    });
  }

  // 3. Check for existing claim
  const existingClaim = await ClaimRequest.findOne({
    where: { itemId: id, claimantId },
  });

  if (existingClaim) {
    return res.status(400).json({
      success: false,
      message: "You have already submitted a claim for this item.",
    });
  }

  // 4. Create ClaimRequest
  const claim = await ClaimRequest.create({
    itemId: id,
    claimantId,
    contactNumber,
    description,
    status: "Pending",
  });

  // 5. Notify the post owner
  const claimant = await User.findByPk(claimantId, {
    attributes: ["id", "name"],
  });
  const claimantName = claimant?.name || "Someone";
  const actionText = item.type === "Lost" ? "found" : "claims to be the owner of";
  
  await notifyUser({
    userId: item.userId,
    actorId: claimantId,
    type: "General",
    title: `${claimantName} ${actionText} your item`,
    content: `"${description.substring(0, 100)}${description.length > 100 ? "..." : ""}" — Contact: ${contactNumber}`,
    referenceId: parseInt(id),
    referenceType: "LostAndFound",
    dedupeKey: `claim:${id}:${claimantId}`,
  });

  return res.status(201).json({
    success: true,
    message: "Your claim has been submitted successfully.",
    data: claim,
  });
});
