import { Order, EventBooking, Transaction, Wallet, ClubEventPost } from "../modules/index.js";
import logger from "../utils/logger.js";

/**
 * Handles the database updates after a successful Order payment
 */
export const processOrderPayment = async (orderId, paymentIntent) => {
  const order = await Order.findByPk(orderId);
  if (!order) return;

  // 1. Update Order Status
  order.status = "Order Placed";
  
  // Update timeline
  const currentTimeline = Array.isArray(order.timeline) ? order.timeline : [];
  order.timeline = [...currentTimeline, { status: "Order Placed", timestamp: new Date() }];
  
  await order.save();

  // 2. Find Seller's Wallet
  const wallet = await Wallet.findOne({ where: { userId: order.sellerId } });
  if (wallet) {
    // 3. Create Transaction record
    await Transaction.create({
      walletId: wallet.id,
      orderId: order.id,
      type: "CREDIT",
      category: "Merchandise",
      amount: order.total,
      status: "COMPLETED",
      stripePaymentIntentId: paymentIntent.id,
      description: `Payment for Order ${order.orderId}`,
    });

    // 4. Update Wallet Balance
    wallet.balance = parseFloat(wallet.balance) + parseFloat(order.total);
    await wallet.save();
    logger.info(`✅ Order ${order.orderId} processed and Wallet credited.`);
  }
};

/**
 * Handles the database updates after a successful Event Booking payment
 */
export const processBookingPayment = async (bookingId, paymentIntent) => {
  const booking = await EventBooking.findByPk(bookingId, {
    include: [{ model: ClubEventPost, as: "event" }]
  });
  if (!booking) return;

  // 1. Update Booking Status
  booking.status = "CONFIRMED";
  booking.paymentStatus = "PAID";
  
  // Update timeline
  const currentTimeline = Array.isArray(booking.timeline) ? booking.timeline : [];
  booking.timeline = [...currentTimeline, { status: "CONFIRMED", timestamp: new Date() }];
  
  await booking.save();

  // 2. Find Club Owner's Wallet
  const sellerId = booking.event?.authorId;
  if (!sellerId) return;

  const wallet = await Wallet.findOne({ where: { userId: sellerId } });
  if (wallet) {
    // 3. Create Transaction record
    await Transaction.create({
      walletId: wallet.id,
      bookingId: booking.id,
      type: "CREDIT",
      category: "Club Tickets",
      amount: booking.total,
      status: "COMPLETED",
      stripePaymentIntentId: paymentIntent.id,
      description: `Ticket Booking for ${booking.event?.name}`,
    });

    // 4. Update Wallet Balance
    wallet.balance = parseFloat(wallet.balance) + parseFloat(booking.total);
    await wallet.save();
    logger.info(`✅ Booking ${booking.bookingId} processed and Wallet credited.`);
  }
};
