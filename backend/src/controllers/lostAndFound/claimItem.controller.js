/**
 * claimItem.controller.js
 *
 * Handles POST /lost-and-found/:id/claim
 *
 * Allows a user to submit a claim on a Lost or Found item.
 * - Creates a ClaimRequest record in the DB.
 * - Fires a notification to the original post owner via the shared notification service.
 * - Prevents post owners from claiming their own items.
 * - Uses a dedupeKey so spamming the button only fires one notification.
 */

import { LostAndFound, User, ClaimRequest } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import { notifyUser } from "../../services/notification.service.js";

export const claimItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { contactNumber, description } = req.body;
  const claimantId = req.user.id;
  const claimantName = req.user.name;

  // Load the item so we know who the owner is
  const item = await LostAndFound.findOne({
    where: { id },
    include: [{ model: User, as: "user", attributes: ["id", "name"] }],
  });

  if (!item) {
    return sendResponse(res, 404, false, "Item not found.");
  }

  const ownerId = item.userId;

  // Post owner cannot claim their own item
  if (ownerId === claimantId) {
    return sendResponse(res, 403, false, "You cannot claim your own item.");
  }

  // Prevent duplicate claims from the same user on the same item
  const existingClaim = await ClaimRequest.findOne({
    where: { itemId: id, claimantId },
  });

  if (existingClaim) {
    return sendResponse(
      res,
      409,
      false,
      "You have already submitted a claim for this item.",
    );
  }

  // Persist the claim
  const claim = await ClaimRequest.create({
    itemId: id,
    claimantId,
    contactNumber,
    description,
    status: "Pending",
  });

  // Build context-aware notification title & content
  const isLostItem = item.type === "Lost";
  const notifTitle = isLostItem
    ? `${claimantName} says they found your item!`
    : `${claimantName} is claiming your found item`;

  const notifContent = `📞 Contact: ${contactNumber}\n\n${description}`;

  // Grab the first image S3 key (if any) so the notification shows a thumbnail.
  // The notification controller signs S3 keys into URLs when serving them.
  const itemImage = item.images && item.images.length > 0 ? item.images[0] : null;

  // Fire notification to the post owner (fails silently — never breaks the main flow)
  await notifyUser({
    userId: ownerId,
    actorId: claimantId,
    type: "General",
    title: notifTitle,
    content: notifContent,
    referenceId: item.id,
    referenceType: "LostAndFound",
    dedupeKey: `claim:${claimantId}:${id}`,
    image: itemImage,
  });

  return sendResponse(res, 201, true, "Claim submitted successfully.", {
    claimId: claim.id,
    status: claim.status,
  });
});
