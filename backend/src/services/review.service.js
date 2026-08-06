export const calculateReviewSummary = (reviews) => {
  const totalReviews = reviews.length;
  let sumRating = 0;
  const distributionCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((r) => {
    sumRating += r.rating;
    if (distributionCounts[r.rating] !== undefined) {
      distributionCounts[r.rating]++;
    }
  });

  const averageRating = totalReviews > 0 ? sumRating / totalReviews : 0;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = distributionCounts[stars];
    const percentage =
      totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, percentage, count };
  });

  return { averageRating, totalReviews, distribution };
};
