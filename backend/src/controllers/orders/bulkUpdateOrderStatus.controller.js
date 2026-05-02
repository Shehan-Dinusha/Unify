import { Order } from "../../modules/index.js";

// Statuses that a club owner is allowed to set (not PENDING or "Order Placed" which are system-set)
const CLUB_OWNER_STATUSES = ["Seller Confirmed", "Ready for Pickup", "Order Completed"];

export const bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { orderIds, status } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ success: false, error: "An array of orderIds is required." });
    }

    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required." });
    }

    if (!CLUB_OWNER_STATUSES.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid status. Club owners can only set: ${CLUB_OWNER_STATUSES.join(", ")}.` 
      });
    }

    const [updatedCount] = await Order.update(
      { status },
      { where: { id: orderIds } }
    );

    res.status(200).json({ 
      success: true, 
      message: `Successfully updated ${updatedCount} orders to "${status}".`,
      updatedCount 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

