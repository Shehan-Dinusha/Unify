import { Order, ClubProductPost, User } from "../../modules/index.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const buyerId = req.user ? req.user.id : req.body.userId;
    if (!buyerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Temporary validation until JWT is fully set up
    const user = await User.findByPk(buyerId);
    if (!user || user.role !== "Student") {
      return res.status(403).json({ error: "Only students can make orders." });
    }

    const {
      postId,
      qty = 1,
      paymentMethod,
      color,
      colorHex,
      size,
    } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required." });
    }

    const post = await ClubProductPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Club product post not found." });
    }

    const price = post.price;
    const subtotal = price * qty;
    const platformFee = 0.00; // Can be calculated based on business logic
    const taxes = 0.00; // Can be calculated based on business logic
    const total = subtotal + platformFee + taxes;

    // Inherit pickup details from the post if applicable
    const pickupLocation = post.pickupNote || null;

    const orderId = `ORD-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const newOrder = await Order.create({
      orderId,
      buyerId,
      sellerId: post.authorId,
      itemId: post.id,
      price,
      qty,
      subtotal,
      platformFee,
      taxes,
      total,
      paymentMethod,
      pickupLocation,
      color,
      colorHex,
      size,
      status: "PENDING",
      timeline: [{ status: "PENDING", timestamp: new Date() }],
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
