import { Order } from "../../modules/index.js";
import { notifyUser } from "../../services/notification.service.js";

// Statuses that a club owner is allowed to set (not PENDING or "Order Placed" which are system-set)
const CLUB_OWNER_STATUSES = ["Seller Confirmed", "Ready for Pickup", "Order Completed"];

const STATUS_NOTIFICATION_CONTENT = {
  "Seller Confirmed": "Your order has been confirmed.",
  "Ready for Pickup": "Your order is ready for pickup.",
  "Order Completed": "Your order has been completed.",
};

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

    const sellerId = req.user.id;
    const orders = await Order.findAll({
      where: { id: orderIds, sellerId },
    });

    const ordersToUpdate = orders.filter((order) => order.status !== status);

    await Promise.all(ordersToUpdate.map(async (order) => {
      let timeline = Array.isArray(order.timeline) ? [...order.timeline] : order.timeline || [];
      if (typeof timeline === "string") {
        try {
          timeline = JSON.parse(timeline);
        } catch {
          timeline = [];
        }
      }

      timeline.push({
        status,
        timestamp: new Date(),
        note: `Order status updated to ${status}`,
      });

      await order.update({ status, timeline });
      await notifyUser({
        userId: order.buyerId,
        actorId: sellerId,
        type: "General",
        title: `Order ${order.orderId} status updated`,
        content: STATUS_NOTIFICATION_CONTENT[status],
        referenceId: order.id,
        referenceType: "Order",
      });
    }));

    const updatedCount = ordersToUpdate.length;

    res.status(200).json({ 
      success: true, 
      message: `Successfully updated ${updatedCount} orders to "${status}".`,
      updatedCount 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
