import {
  Review,
  User,
  StudentProfile,
  ClubProfile,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { formatRelativeDate } from "../../utils/date.js";

export const getReceivedReviews = async (req, res, next) => {
  try {
    const targetId = req.user?.id || 4; // Fallback to 1 for testing if req.user is not yet defined

    const targetExists = await User.findByPk(targetId);
    if (!targetExists) {
      return sendResponse(res, 404, false, "Target user not found.");
    }

    if (targetExists.role !== "Business") {
      return sendResponse(
        res,
        400,
        false,
        "Only Business accounts can view received reviews from this endpoint.",
      );
    }

    const rawReviews = await Review.findAll({
      where: { targetId },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "name", "role", "avatar"],
          include: [
            {
              model: StudentProfile,
              as: "studentProfile",
              attributes: ["isBatchRep"],
              required: false,
            },
            {
              model: ClubProfile,
              as: "clubProfile",
              attributes: ["isVerified"],
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
    const distributionCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    rawReviews.forEach((r) => {
      sumRating += r.rating;
      if (distributionCounts[r.rating] !== undefined) {
        distributionCounts[r.rating]++;
      }
    });

    const averageRating =
      totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : 0;

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
          let actualRole = review.reviewer.role;
          let isVerified = false;

          if (
            review.reviewer.role === "Student" &&
            review.reviewer.studentProfile?.isBatchRep
          ) {
            actualRole = "Batch Rep";
            isVerified = true;
          } else if (
            review.reviewer.role === "Club" &&
            review.reviewer.clubProfile?.isVerified
          ) {
            isVerified = true;
          }

          author = {
            name: review.reviewer.name,
            role: actualRole,
            isVerified: isVerified,
            avatar: review.reviewer.avatar,
            initials: review.reviewer.name
              ? review.reviewer.name.substring(0, 2).toUpperCase()
              : "U",
            bgColor: "bg-blue-600",
          };
        }
      }

      const dateStr = formatRelativeDate(review.createdAt);

      let parsedOwnerReply = null;
      let hasOwnerReplied = false;
      if (review.ownerReply) {
        hasOwnerReplied = true;
        parsedOwnerReply = {
          content: review.ownerReply,
          createdAt: formatRelativeDate(review.updatedAt),
        };
      }

      return {
        id: review.id,
        rating: review.rating,
        content: review.content,
        helpfulCount: review.helpfulCount || 0,
        notHelpfulCount: review.notHelpfulCount || 0,
        isLikedByOwner: review.isLikedByOwner || false,
        createdAt: dateStr,
        author,
        hasOwnerReplied,
        ownerReply: parsedOwnerReply,
      };
    });

    return sendResponse(
      res,
      200,
      true,
      "Received reviews fetched successfully",
      {
        reviews: formattedReviews,
        summary,
      },
    );
  } catch (error) {
    logger.error("Error fetching received reviews", error);
    next(error);
  }
};
