import { Review, User, BusinessProfile } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { formatRelativeDate } from "../../utils/date.js";

export const getMyReviews = async (req, res, next) => {
  try {
    // Fallback to 1 for testing if req.user is not yet defined
    const currentUserId = req.user?.id || 1;

    const rawReviews = await Review.findAll({
      where: { reviewerId: currentUserId },
      include: [
        {
          model: User,
          as: "target",
          attributes: ["id", "name", "avatar"],
          include: [
            {
              model: BusinessProfile,
              as: "businessProfile",
              attributes: ["businessName", "displayName", "category"],
              required: false,
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // 1. Calculate Summary Stats
    const totalReviews = rawReviews.length;
    let sumRating = 0;
    const categoryStats = {};

    rawReviews.forEach((r) => {
      sumRating += r.rating;

      const category = r.target?.businessProfile?.category;

      if (category) {
        if (!categoryStats[category]) {
          categoryStats[category] = { count: 0, totalRating: 0 };
        }
        categoryStats[category].count++;
        categoryStats[category].totalRating += r.rating;
      }
    });

    const averageRating =
      totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : 0;

    let topCategory = "N/A";
    let maxCount = 0;
    let maxAvgRating = 0;

    Object.entries(categoryStats).forEach(([cat, stats]) => {
      const avgRating = stats.totalRating / stats.count;

      if (stats.count > maxCount) {
        maxCount = stats.count;
        maxAvgRating = avgRating;
        topCategory = cat;
      } else if (stats.count === maxCount) {
        // Tie-breaker: Highest average rating wins
        if (avgRating > maxAvgRating) {
          maxAvgRating = avgRating;
          topCategory = cat;
        }
      }
    });

    const summary = {
      totalReviews,
      averageRating,
      topCategory,
    };

    // 2. Format Reviews List
    const formattedReviews = rawReviews.map((modelReview) => {
      const review = modelReview.toJSON();

      const targetUser = review.target || {};
      const bizProfile = targetUser.businessProfile || {};

      const targetName =
        bizProfile.businessName ||
        bizProfile.displayName ||
        targetUser.name ||
        "Unknown Business";
      const category = bizProfile.category;

      let parsedOwnerReply = null;
      if (review.ownerReply) {
        parsedOwnerReply = {
          content: review.ownerReply,
          author: {
            name: targetName,
            avatar: targetUser.avatar,
          },
          createdAt: formatRelativeDate(review.updatedAt),
        };
      }

      return {
        id: review.id,
        targetId: review.targetId,
        targetName,
        targetAvatar: targetUser.avatar,
        category,
        rating: review.rating,
        content: review.content,
        helpfulCount: review.helpfulCount || 0,
        notHelpfulCount: review.notHelpfulCount || 0,
        isLikedByOwner: review.isLikedByOwner || false,
        createdAt: formatRelativeDate(review.createdAt),
        ownerReply: parsedOwnerReply,
      };
    });

    return sendResponse(res, 200, true, "My reviews fetched successfully", {
      reviews: formattedReviews,
      summary,
    });
  } catch (error) {
    logger.error("Error fetching my reviews", error);
    next(error);
  }
};
