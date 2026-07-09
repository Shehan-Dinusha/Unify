import { Order, User, StudentProfile, Faculty } from "../../modules/index.js";
import sequelize from "../../config/database.js";

export const getClubBuyerDemographics = async (req, res) => {
  try {
    const clubOwnerId = req.params.userId || (req.user ? req.user.id : null);

    if (!clubOwnerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const demographics = await Order.findAll({
      where: { sellerId: clubOwnerId },
      include: [
        {
          model: User,
          as: "buyer",
          attributes: [],
          required: false,
          include: [
            {
              model: StudentProfile,
              as: "studentProfile",
              attributes: [],
              required: false,
              include: [
                {
                  model: Faculty,
                  as: "faculty",
                  attributes: [],
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        [sequelize.col("buyer.studentProfile.faculty.name"), "facultyName"],
        [sequelize.fn("COUNT", sequelize.col("Order.id")), "count"],
      ],
      group: ["buyer.studentProfile.faculty.name"],
      raw: true,
    });

    // Calculate percentages
    const totalCount = demographics.reduce((acc, d) => acc + parseInt(d.count, 10), 0);
    const formattedDemographics = demographics.map(d => ({
      faculty: d.facultyName || "Other",
      count: parseInt(d.count, 10),
      percentage: totalCount > 0 ? ((parseInt(d.count, 10) / totalCount) * 100).toFixed(1) : 0
    }));

    res.status(200).json({
      success: true,
      data: formattedDemographics,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
