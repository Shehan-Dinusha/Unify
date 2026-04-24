import { Order } from "../../modules/index.js";

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const sellerId = req.user ? req.user.id : req.body.userId;

    if (!sellerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Ensure only the seller can update the order status
    if (order.sellerId !== parseInt(sellerId, 10)) {
      return res.status(403).json({ error: "Only the seller can update the order status." });
    }

    let timeline = order.timeline || [];
    if (typeof timeline === 'string') {
      try { timeline = JSON.parse(timeline); } catch(e) { timeline = []; }
    }

    timeline.push({ status, timestamp: new Date() });

    await order.update({
      status,
      timeline,
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
