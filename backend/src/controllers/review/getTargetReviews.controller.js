import { Review, User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const getTargetReviews = async (req, res, next) => {
  try {
    const { targetId } = req.params;

    // Fallback to 1 for testing if req.user is not yet defined
    const currentUserId = req.user?.id || 1;

    if (!targetId) {
      return sendResponse(res, 400, false, "Target ID is required.");
    }

    const targetExists = await User.findByPk(targetId);
    if (!targetExists) {
      return sendResponse(res, 404, false, "Target user not found.");
    }

    const rawReviews = await Review.findAll({
      where: { targetId },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "name", "role", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // 1. Calculate Summary Stats
    const totalReviews = rawReviews.length;
    let sumRating = 0;
    const distributionCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    rawReviews.forEach((r) => {
      sumRating += r.rating;
      if (distributionCounts[r.rating] !== undefined) {
        distributionCounts[r.rating]++;
      }
    });

    const averageRating = totalReviews > 0 ? sumRating / totalReviews : 0;

    // Format distribution into percentages as expected by frontend
    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = distributionCounts[stars];
      const percentage =
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return { stars, percentage, count };
    });

    const summary = {
      averageRating,
      totalReviews,
      distribution,
    };

    // 2. Format Reviews list for frontend expectations
    const formattedReviews = rawReviews.map((modelReview) => {
      const review = modelReview.toJSON();
      const isOwn = review.reviewerId === currentUserId;

      let author = {
        name: "Deleted User",
        role: "Unknown",
        avatar: null,
      };

      if (review.reviewer) {
        if (review.isAnonymous) {
          author = {
            name: "Anonymous User",
            role: "User",
            avatar: null,
            initials: "A",
            bgColor: "bg-gray-600",
          };
        } else {
          author = {
            name: review.reviewer.name,
            role: review.reviewer.role,
            avatar: review.reviewer.avatar,
            initials: review.reviewer.name
              ? review.reviewer.name.substring(0, 2).toUpperCase()
              : "U",
            bgColor: "bg-blue-600",
          };
        }
      }

      // Basic formatting of date. The frontend says "Just now" or "2 days ago",
      // but sending raw ISO string lets frontend format it perfectly with date-fns or similar.
      // For demonstration returning raw or basic Date string.
      const dateStr = new Date(review.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      let parsedOwnerReply = null;
      if (review.ownerReply) {
        parsedOwnerReply = {
          content: review.ownerReply,
          author: {
            name: "Owner",
            avatar: null,
          },
        };
      }

      return {
        id: review.id,
        rating: review.rating,
        content: review.content,
        helpfulCount: review.helpfulCount || 0,
        notHelpfulCount: review.notHelpfulCount || 0,
        isOwn,
        isLikedByOwner: review.isLikedByOwner,
        createdAt: dateStr,
        author,
        ownerReply: parsedOwnerReply,
      };
    });

    return sendResponse(res, 200, true, "Reviews fetched successfully", {
      reviews: formattedReviews,
      summary,
    });
  } catch (error) {
    logger.error("Error fetching target reviews", error);
    next(error);
  }
};
