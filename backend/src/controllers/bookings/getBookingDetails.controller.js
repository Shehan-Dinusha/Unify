import { EventBooking, ClubEventPost, User, Transaction } from "../../modules/index.js";

export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await EventBooking.findByPk(id, {
      include: [
        {
          model: ClubEventPost,
          as: "event",
          attributes: ["id", "name", "description", "coverImage", "date", "time", "location", "tiers"],
        },
        {
          model: User,
          as: "user", // The student who booked
          attributes: ["id", "name", "avatar"],
        },
        {
          // We need the club owner too. The association 'event' gives us the event, 
          // but we might need to deep include the club owner.
          model: ClubEventPost,
          as: "event",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "name", "avatar"],
            }
          ]
        },
        {
          model: Transaction,
          as: "transaction",
          attributes: ["id", "status", "amount", "createdAt"],
        }
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
