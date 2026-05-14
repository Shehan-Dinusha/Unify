import {
  Review,
  User,
  StudentProfile,
  ClubProfile,
  ReviewFeedback,
  BusinessProfile,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { formatRelativeDate } from "../../utils/date.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

export const getTargetReviews = async (req, res, next) => {
  try {
    const { targetId } = req.params;

    const currentUserId = req.user.id;

    const targetExists = await User.findByPk(targetId);
    if (!targetExists) {
      return sendResponse(res, 404, false, "Target user not found.");
    }

    if (targetExists.role !== "Business") {
      return sendResponse(res, 400, false, "Target is not a Business account.");
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
        {
          model: ReviewFeedback,
          as: "feedbacks",
          attributes: ["userId", "isHelpful"],
          where: { userId: currentUserId },
          required: false,
        },
        {
          model: User,
          as: "target",
          attributes: ["id", "name", "role", "avatar"],
          include: [
            {
              model: BusinessProfile,
              as: "businessProfile",
              attributes: ["businessName", "displayName"],
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
    const formattedReviews = await Promise.all(
      rawReviews.map(async (modelReview) => {
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
            let actualRole = review.reviewer.role;
            let isVerified = false;

            const avatarUrl = await resolveAvatarUrl(
              review.reviewer.avatar,
              review.reviewer.name,
            );

            // Determine specific identity
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
              avatar: avatarUrl,
              initials: review.reviewer.name
                ? review.reviewer.name.substring(0, 2).toUpperCase()
                : "U",
              bgColor: "bg-blue-600",
            };
          }
        }

        // Basic formatting of date. The frontend says "Just now" or "2 days ago",
        // formatting relative date using util function.
        const dateStr = formatRelativeDate(review.createdAt);

        let parsedOwnerReply = null;
        if (review.ownerReply) {
          const targetUser = review.target || {};
          const bizProfile = targetUser.businessProfile || {};
          const ownerName =
            bizProfile.businessName ||
            bizProfile.displayName ||
            targetUser.name ||
            "Owner";

          const ownerAvatarUrl = await resolveAvatarUrl(
            targetUser.avatar,
            ownerName,
          );

          parsedOwnerReply = {
            content: review.ownerReply,
            author: {
              name: ownerName,
              avatar: ownerAvatarUrl,
            },
            createdAt: formatRelativeDate(review.updatedAt),
          };
        }

        let currentUserFeedback = null;
        if (review.feedbacks && review.feedbacks.length > 0) {
          currentUserFeedback = review.feedbacks[0].isHelpful
            ? "helpful"
            : "not_helpful";
        }

        return {
          id: review.id,
          rating: review.rating,
          content: review.content,
          helpfulCount: review.helpfulCount || 0,
          notHelpfulCount: review.notHelpfulCount || 0,
          currentUserFeedback: currentUserFeedback,
          isOwn,
          isLikedByOwner: review.isLikedByOwner,
          createdAt: dateStr,
          author,
          ownerReply: parsedOwnerReply,
        };
      }),
    );

    return sendResponse(res, 200, true, "Reviews fetched successfully", {
      reviews: formattedReviews,
      summary,
    });
  } catch (error) {
    logger.error("Error fetching target reviews", error);
    next(error);
  }
};
