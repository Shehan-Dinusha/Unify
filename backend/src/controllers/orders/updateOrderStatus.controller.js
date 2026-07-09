import { Order } from "../../modules/index.js";
import { notifyUser } from "../../services/notification.service.js";

const STATUS_NOTIFICATION_CONTENT = {
  "Seller Confirmed": "Your order has been confirmed.",
  "Ready for Pickup": "Your order is ready for pickup.",
  "Order Completed": "Your order has been completed.",
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    
    const sellerId = req.user ? req.user.id : req.body.sellerId;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Ensure only the seller can update the order status
    if (sellerId && order.sellerId !== parseInt(sellerId, 10)) {
      return res.status(403).json({ error: "Unauthorized to update this order." });
    }

    if (order.status === status) {
      return res.status(200).json({ success: true, order });
    }

    let timeline = Array.isArray(order.timeline) ? [...order.timeline] : order.timeline || [];
    if (typeof timeline === "string") {
      try {
        timeline = JSON.parse(timeline);
      } catch (e) {
        timeline = [];
      }
    }

    // Add new entry to timeline
    timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    await order.update({
      status,
      timeline,
    });

    const notificationContent = STATUS_NOTIFICATION_CONTENT[status];
    if (notificationContent) {
      await notifyUser({
        userId: order.buyerId,
        actorId: parseInt(sellerId, 10),
        type: "General",
        title: `Order ${order.orderId} status updated`,
        content: notificationContent,
        referenceId: order.id,
        referenceType: "Order",
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
