import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateReviewSummary } from "../../../src/services/review.service.js";

describe("calculateReviewSummary", () => {
  it("returns zeros for empty reviews", () => {
    const result = calculateReviewSummary([]);
    assert.equal(result.averageRating, 0);
    assert.equal(result.totalReviews, 0);
    result.distribution.forEach((d) => {
      assert.equal(d.count, 0);
      assert.equal(d.percentage, 0);
    });
  });

  it("handles single 5-star review", () => {
    const result = calculateReviewSummary([{ rating: 5 }]);
    assert.equal(result.averageRating, 5);
    assert.equal(result.totalReviews, 1);
    assert.equal(result.distribution[0].stars, 5);
    assert.equal(result.distribution[0].count, 1);
    assert.equal(result.distribution[0].percentage, 100);
    [4, 3, 2, 1].forEach((stars) => {
      const entry = result.distribution.find((d) => d.stars === stars);
      assert.equal(entry.count, 0);
      assert.equal(entry.percentage, 0);
    });
  });

  it("handles single 1-star review", () => {
    const result = calculateReviewSummary([{ rating: 1 }]);
    assert.equal(result.averageRating, 1);
    assert.equal(result.totalReviews, 1);
    assert.equal(result.distribution[4].stars, 1);
    assert.equal(result.distribution[4].count, 1);
    assert.equal(result.distribution[4].percentage, 100);
  });

  it("computes average correctly for 5 and 1", () => {
    const result = calculateReviewSummary([{ rating: 5 }, { rating: 1 }]);
    assert.equal(result.averageRating, 3);
    assert.equal(result.totalReviews, 2);
    assert.equal(result.distribution[0].count, 1);
    assert.equal(result.distribution[0].percentage, 50);
    assert.equal(result.distribution[4].count, 1);
    assert.equal(result.distribution[4].percentage, 50);
  });

  it("puts all reviews in same bucket when ratings are identical", () => {
    const reviews = [
      { rating: 3 },
      { rating: 3 },
      { rating: 3 },
      { rating: 3 },
    ];
    const result = calculateReviewSummary(reviews);
    assert.equal(result.averageRating, 3);
    assert.equal(result.totalReviews, 4);
    assert.equal(result.distribution[2].stars, 3);
    assert.equal(result.distribution[2].count, 4);
    assert.equal(result.distribution[2].percentage, 100);
  });

  it("rounds percentage correctly for 1 out of 3 (33%)", () => {
    const result = calculateReviewSummary([
      { rating: 5 },
      { rating: 1 },
      { rating: 1 },
    ]);
    assert.equal(result.distribution[0].percentage, 33);
    assert.equal(result.distribution[4].percentage, 67);
  });

  it("handles mixed distribution correctly", () => {
    const reviews = [
      { rating: 5 },
      { rating: 5 },
      { rating: 4 },
      { rating: 3 },
      { rating: 2 },
      { rating: 1 },
      { rating: 5 },
      { rating: 4 },
      { rating: 3 },
      { rating: 2 },
    ];
    const result = calculateReviewSummary(reviews);
    assert.equal(result.totalReviews, 10);
    assert.equal(result.averageRating, 3.4);
    assert.equal(result.distribution[0].count, 3);
    assert.equal(result.distribution[0].percentage, 30);
    assert.equal(result.distribution[1].count, 2);
    assert.equal(result.distribution[1].percentage, 20);
    assert.equal(result.distribution[2].count, 2);
    assert.equal(result.distribution[2].percentage, 20);
    assert.equal(result.distribution[3].count, 2);
    assert.equal(result.distribution[3].percentage, 20);
    assert.equal(result.distribution[4].count, 1);
    assert.equal(result.distribution[4].percentage, 10);
  });

  it("distribution percentages sum to 100 (within rounding)", () => {
    const reviews = [
      { rating: 5 },
      { rating: 5 },
      { rating: 5 },
      { rating: 4 },
      { rating: 1 },
    ];
    const result = calculateReviewSummary(reviews);
    const totalPercent = result.distribution.reduce(
      (sum, d) => sum + d.percentage,
      0,
    );
    assert.ok(totalPercent === 100 || totalPercent === 99 || totalPercent === 101);
  });

  it("handles rating at every level", () => {
    const reviews = [
      { rating: 5 },
      { rating: 4 },
      { rating: 3 },
      { rating: 2 },
      { rating: 1 },
    ];
    const result = calculateReviewSummary(reviews);
    assert.equal(result.averageRating, 3);
    assert.equal(result.totalReviews, 5);
    result.distribution.forEach((d) => {
      assert.equal(d.count, 1);
      assert.equal(d.percentage, 20);
    });
  });

  it("does not crash on ratings outside 1-5 range", () => {
    const result = calculateReviewSummary([
      { rating: 5 },
      { rating: 99 },
      { rating: -1 },
    ]);
    assert.equal(result.totalReviews, 3);
    assert.equal(typeof result.averageRating, "number");
    assert.ok(Array.isArray(result.distribution));
  });
});
