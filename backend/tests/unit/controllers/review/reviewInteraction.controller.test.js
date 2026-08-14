import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { toggleReviewFeedback } from "../../../../src/controllers/review/reviewInteraction.controller.js";
import { Review, ReviewFeedback } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeReview = (overrides = {}) => ({
  id: 1,
  reviewerId: 3,
  targetId: 2,
  helpfulCount: 5,
  notHelpfulCount: 2,
  async save() {},
  ...overrides,
});

describe("toggleReviewFeedback", () => {
  it("returns 404 if the review is not found", async () => {
    mock.method(Review, "findByPk", async () => null);

    const req = { user: { id: 9, name: "U" }, params: { reviewId: "999" }, body: { action: "helpful" } };
    const res = createRes();
    const next = mockNext();

    await toggleReviewFeedback(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Review not found/i);
  });

  it("adds a new helpful feedback", async () => {
    mock.method(Review, "findByPk", async () => makeReview());
    mock.method(ReviewFeedback, "findOne", async () => null);
    const createFn = mock.fn(async (data) => ({ id: 10, ...data }));
    mock.method(ReviewFeedback, "create", createFn);

    const req = { user: { id: 9, name: "U" }, params: { reviewId: "1" }, body: { action: "helpful" } };
    const res = createRes();
    const next = mockNext();

    await toggleReviewFeedback(req, res, next);

    assert.equal(res.getStatusCode(), 201);
    const args = createFn.mock.calls[0].arguments[0];
    assert.equal(args.reviewId, "1");
    assert.equal(args.userId, 9);
    assert.equal(args.isHelpful, true);
    assert.equal(res.getBody().data.feedbackModified, "added");
    assert.equal(res.getBody().data.helpfulCount, 6);
    assert.equal(res.getBody().data.notHelpfulCount, 2);
    assert.equal(next.called, false);
  });

  it("adds a new not_helpful feedback", async () => {
    mock.method(Review, "findByPk", async () => makeReview());
    mock.method(ReviewFeedback, "findOne", async () => null);
    mock.method(ReviewFeedback, "create", async (data) => ({ id: 11, ...data }));

    const req = { user: { id: 9, name: "U" }, params: { reviewId: "1" }, body: { action: "not_helpful" } };
    const res = createRes();
    const next = mockNext();

    await toggleReviewFeedback(req, res, next);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(res.getBody().data.notHelpfulCount, 3);
  });

  it("removes an existing matching feedback", async () => {
    const destroy = mock.fn(async () => {});
    const feedback = { id: 20, isHelpful: true, destroy };
    mock.method(Review, "findByPk", async () => makeReview());
    mock.method(ReviewFeedback, "findOne", async () => feedback);

    const req = { user: { id: 9, name: "U" }, params: { reviewId: "1" }, body: { action: "helpful" } };
    const res = createRes();
    const next = mockNext();

    await toggleReviewFeedback(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().data.feedbackModified, "removed");
    assert.equal(res.getBody().data.helpfulCount, 4);
    assert.equal(destroy.mock.calls.length, 1);
  });

  it("switches a helpful feedback to not_helpful", async () => {
    const feedback = { id: 20, isHelpful: true, async save() {} };
    mock.method(Review, "findByPk", async () => makeReview());
    mock.method(ReviewFeedback, "findOne", async () => feedback);

    const req = { user: { id: 9, name: "U" }, params: { reviewId: "1" }, body: { action: "not_helpful" } };
    const res = createRes();
    const next = mockNext();

    await toggleReviewFeedback(req, res, next);

    assert.equal(feedback.isHelpful, false);
    assert.equal(res.getBody().data.feedbackModified, "updated");
    assert.equal(res.getBody().data.helpfulCount, 4);
    assert.equal(res.getBody().data.notHelpfulCount, 3);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(Review, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 9, name: "U" }, params: { reviewId: "1" }, body: { action: "helpful" } };
    const res = createRes();
    const next = mockNext();

    await toggleReviewFeedback(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
