import {
  User,
  StudentProfile,
  BusinessProfile,
  Review,
  ReviewFeedback,
} from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import bcrypt from "bcryptjs";

export const seedReviews = catchAsync(async (req, res) => {
  // 1. Create a primary student user (if not exists)
  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);
  
  const [studentUser] = await User.findOrCreate({
    where: { id: 1 },
    defaults: {
      id: 1,
      name: "Alex Johnson",
      email: "alex@student.unify.com",
      passwordHash: defaultPasswordHash,
      role: "Student",
      isOnline: true,
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
  });

  await StudentProfile.findOrCreate({
    where: { userId: studentUser.id },
    defaults: {
      userId: studentUser.id,
      universityId: 1,
      facultyId: 1,
      degreeId: 1,
      batchId: 1,
      isBatchRep: false,
    },
  });

  // 2. Create additional mock students to act as other reviewers
  const reviewersData = [
    { id: 10, name: "Sarah Jenkins", email: "sarah@student.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { id: 11, name: "David Miller", email: "david@student.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
    { id: 12, name: "Emma Wilson", email: "emma@student.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
  ];

  for (const r of reviewersData) {
    const [u] = await User.findOrCreate({
      where: { id: r.id },
      defaults: {
        id: r.id,
        name: r.name,
        email: r.email,
        passwordHash: defaultPasswordHash,
        role: "Student",
        avatar: r.avatar,
      },
    });
    await StudentProfile.findOrCreate({
      where: { userId: u.id },
      defaults: { userId: u.id },
    });
  }

  // 3. Use the existing Business user (ID 3 - "Campus Bites & Cafe") as the target
  const TARGET_BUSINESS_ID = 3;
  const businessUser = await User.findByPk(TARGET_BUSINESS_ID);
  if (!businessUser || businessUser.role !== "Business") {
    return sendResponse(res, 400, false, "Business user (ID 3) not found or not a Business role.");
  }

  // 4. Create Mock Reviews for the Business user
  const reviewsToSeed = [
    {
      reviewerId: 1, // The logged in user
      targetId: TARGET_BUSINESS_ID,
      rating: 4,
      content: "Great service! I bought food here and the quality is always top notch. Highly recommend.",
      isAnonymous: false,
      ownerReply: "Thank you Alex! We're glad you enjoy our food.",
      helpfulCount: 12,
      isLikedByOwner: true,
    },
    {
      reviewerId: 10,
      targetId: TARGET_BUSINESS_ID,
      rating: 5,
      content: "Best campus food spot! Their customer service was extremely helpful when I had an issue with my order.",
      isAnonymous: false,
      helpfulCount: 8,
    },
    {
      reviewerId: 11,
      targetId: TARGET_BUSINESS_ID,
      rating: 3,
      content: "Prices are okay, but they often run out of popular menu items during rush hours.",
      isAnonymous: true,
      helpfulCount: 2,
      notHelpfulCount: 1,
    },
    {
      reviewerId: 12,
      targetId: TARGET_BUSINESS_ID,
      rating: 5,
      content: "Absolutely amazing food and friendly staff! I will definitely come back again.",
      isAnonymous: false,
      helpfulCount: 0,
    },
  ];

  for (const review of reviewsToSeed) {
    const [rev, created] = await Review.findOrCreate({
      where: { reviewerId: review.reviewerId, targetId: review.targetId },
      defaults: {
        reviewerId: review.reviewerId,
        targetId: review.targetId,
        rating: review.rating,
        content: review.content,
        isAnonymous: review.isAnonymous,
        ownerReply: review.ownerReply || null,
        helpfulCount: review.helpfulCount || 0,
        notHelpfulCount: review.notHelpfulCount || 0,
        isLikedByOwner: review.isLikedByOwner || false,
      },
    });

    if (!created) {
      // If it exists, let's update it to ensure our seed data is fresh
      await rev.update({
        rating: review.rating,
        content: review.content,
        ownerReply: review.ownerReply || null,
        helpfulCount: review.helpfulCount || 0,
        notHelpfulCount: review.notHelpfulCount || 0,
        isLikedByOwner: review.isLikedByOwner || false,
      });
    }
  }

  return sendResponse(res, 201, true, "Reviews seeded successfully!");
});
