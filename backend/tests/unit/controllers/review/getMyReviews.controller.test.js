import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { getMyReviews } from "../../../../src/controllers/review/getMyReviews.controller.js";
import { Review } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeReview = (overrides = {}) => {
  const row = {
    id: 1,
    reviewerId: 1,
    targetId: 2,
    rating: 4,
    content: "Great service",
    helpfulCount: 2,
    notHelpfulCount: 1,
    isLikedByOwner: true,
    ownerReply: null,
    createdAt: new Date("2026-05-01T10:00:00Z"),
    updatedAt: new Date("2026-05-02T10:00:00Z"),
    target: {
      id: 2,
      name: "Biz User",
      avatar: null,
      businessProfile: { businessName: "ABC Shop", displayName: "ABC", category: "Food" },
    },
    ...overrides,
  };
  return { ...row, toJSON: () => ({ ...row }) };
};

describe("getMyReviews", () => {
  it("returns 200 with reviews and summary stats", async () => {
    mock.method(Review, "findAll", async () => [
      makeReview({ id: 1, rating: 5, target: { id: 2, name: "A", avatar: null, businessProfile: { businessName: "Cafe A", displayName: "A", category: "Food" } } }),
      makeReview({ id: 2, rating: 3, target: { id: 3, name: "B", avatar: null, businessProfile: { businessName: "Shop B", displayName: "B", category: "Retail" } } }),
    ]);

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await getMyReviews(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const body = res.getBody();
    assert.equal(body.success, true);
    assert.equal(body.data.summary.totalReviews, 2);
    assert.equal(body.data.summary.averageRating, "4.0");
    assert.equal(body.data.reviews.length, 2);
    assert.equal(body.data.reviews[0].targetName, "Cafe A");
    assert.equal(body.data.reviews[0].category, "Food");
    assert.equal(body.data.reviews[0].rating, 5);
    assert.equal(body.data.reviews[0].helpfulCount, 2);
    assert.equal(body.data.reviews[0].isLikedByOwner, true);
  });

  it("picks the top category by count with average-rating tie-break", async () => {
    mock.method(Review, "findAll", async () => [
      makeReview({ id: 1, rating: 2, target: { id: 2, name: "A", avatar: null, businessProfile: { businessName: "A", displayName: "A", category: "Food" } } }),
      makeReview({ id: 2, rating: 5, target: { id: 3, name: "B", avatar: null, businessProfile: { businessName: "B", displayName: "B", category: "Food" } } }),
      makeReview({ id: 3, rating: 4, target: { id: 4, name: "C", avatar: null, businessProfile: { businessName: "C", displayName: "C", category: "Retail" } } }),
    ]);

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await getMyReviews(req, res, next);

    const summary = res.getBody().data.summary;
    assert.equal(summary.totalReviews, 3);
    assert.equal(summary.averageRating, "3.7");
    assert.equal(summary.topCategory, "Food");
  });

  it("parses an owner reply when present", async () => {
    mock.method(Review, "findAll", async () => [
      makeReview({ ownerReply: "Thanks for the review!", updatedAt: new Date("2026-05-02T10:00:00Z") }),
    ]);

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await getMyReviews(req, res, next);

    const review = res.getBody().data.reviews[0];
    assert.equal(review.ownerReply.content, "Thanks for the review!");
    assert.equal(review.ownerReply.author.name, "ABC Shop");
  });

  it("returns empty summary for a user with no reviews", async () => {
    mock.method(Review, "findAll", async () => []);

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await getMyReviews(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const summary = res.getBody().data.summary;
    assert.equal(summary.totalReviews, 0);
    assert.equal(summary.averageRating, 0);
    assert.equal(summary.topCategory, "N/A");
    assert.deepEqual(res.getBody().data.reviews, []);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(Review, "findAll", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await getMyReviews(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
