import { EventBooking, ClubEventPost, User } from "../../modules/index.js";
import crypto from "crypto";

export const createEventBooking = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const { eventId, tierId, qty = 1 } = req.body;

    if (!eventId || !tierId) {
      return res.status(400).json({ error: "Event ID and Tier ID are required." });
    }

    const event = await ClubEventPost.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Find the tier details from the JSON field
    // event.tiers is an array of objects which contains { name, price, isFree }
    const selectedTier = event.tiers?.find(t => 
      String(t.id) === String(tierId) || 
      t.label === tierId || 
      t.name === tierId
    );
    
    if (!selectedTier) {
      return res.status(400).json({ error: "Invalid tier selected." });
    }

    const price = parseFloat(selectedTier.price) || 0;
    const total = price * qty;

    const bookingId = `BOK-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    const booking = await EventBooking.create({
      bookingId,
      userId,
      eventId,
      tierId: selectedTier.id || selectedTier.label || selectedTier.name,
      price,
      qty,
      total,
      status: price === 0 ? "CONFIRMED" : "PENDING",
      paymentStatus: price === 0 ? "PAID" : "UNPAID",
      timeline: [{ status: price === 0 ? "CONFIRMED" : "PENDING", timestamp: new Date() }],
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
