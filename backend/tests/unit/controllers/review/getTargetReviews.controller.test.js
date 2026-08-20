import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { getTargetReviews } from "../../../../src/controllers/review/getTargetReviews.controller.js";
import { Review, User } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeReview = (overrides = {}) => {
  const row = {
    id: 1,
    reviewerId: 3,
    targetId: 2,
    rating: 5,
    content: "Nice place",
    helpfulCount: 0,
    notHelpfulCount: 0,
    isLikedByOwner: false,
    isAnonymous: false,
    ownerReply: null,
    createdAt: new Date("2026-05-01T10:00:00Z"),
    updatedAt: new Date("2026-05-02T10:00:00Z"),
    reviewer: {
      id: 3,
      name: "Alice",
      role: "Student",
      avatar: null,
      studentProfile: null,
      clubProfile: null,
    },
    feedbacks: [],
    target: {
      id: 2,
      name: "Biz",
      role: "Business",
      avatar: null,
      businessProfile: null,
    },
    ...overrides,
  };
  return { ...row, toJSON: () => ({ ...row }) };
};

const businessTarget = { id: 2, name: "Biz", role: "Business" };

describe("getTargetReviews", () => {
  it("returns 404 if the target user does not exist", async () => {
    mock.method(User, "findByPk", async () => null);

    const req = { user: { id: 1 }, params: { targetId: "999" } };
    const res = createRes();
    const next = mockNext();

    await getTargetReviews(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Target user not found/i);
  });

  it("returns 400 if the target is not a Business account", async () => {
    mock.method(User, "findByPk", async () => ({ id: 2, role: "Student" }));

    const req = { user: { id: 1 }, params: { targetId: "2" } };
    const res = createRes();
    const next = mockNext();

    await getTargetReviews(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Target is not a Business account/i);
  });

  it("returns 200 with summary and formatted reviews", async () => {
    mock.method(User, "findByPk", async () => businessTarget);
    mock.method(Review, "findAll", async () => [
      makeReview({ id: 1, rating: 5 }),
      makeReview({ id: 2, rating: 3 }),
    ]);

    const req = { user: { id: 1 }, params: { targetId: "2" } };
    const res = createRes();
    const next = mockNext();

    await getTargetReviews(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const body = res.getBody();
    assert.equal(body.data.summary.totalReviews, 2);
    assert.equal(body.data.summary.averageRating, 4);
    assert.equal(body.data.reviews[0].author.name, "Alice");
    assert.equal(body.data.reviews[0].isOwn, false);
    assert.equal(body.data.reviews[0].currentUserFeedback, null);
  });

  it("masks the author when the review is anonymous", async () => {
    mock.method(User, "findByPk", async () => businessTarget);
    mock.method(Review, "findAll", async () => [makeReview({ isAnonymous: true })]);

    const req = { user: { id: 1 }, params: { targetId: "2" } };
    const res = createRes();
    const next = mockNext();

    await getTargetReviews(req, res, next);

    const author = res.getBody().data.reviews[0].author;
    assert.equal(author.name, "Anonymous User");
    assert.equal(author.role, "User");
    assert.equal(author.initials, "A");
  });

  it("labels batch reps and verified clubs as verified reviewers", async () => {
    mock.method(User, "findByPk", async () => businessTarget);
    mock.method(Review, "findAll", async () => [
      makeReview({
        reviewer: { id: 3, name: "Rep", role: "Student", avatar: null, studentProfile: { isBatchRep: true }, clubProfile: null },
      }),
      makeReview({
        id: 2,
        reviewer: { id: 4, name: "Club", role: "Club", avatar: null, studentProfile: null, clubProfile: { isVerified: true } },
      }),
    ]);

    const req = { user: { id: 1 }, params: { targetId: "2" } };
    const res = createRes();
    const next = mockNext();

    await getTargetReviews(req, res, next);

    const reviews = res.getBody().data.reviews;
    assert.equal(reviews[0].author.role, "Batch Rep");
    assert.equal(reviews[0].author.isVerified, true);
    assert.equal(reviews[1].author.role, "Club");
    assert.equal(reviews[1].author.isVerified, true);
  });

  it("flags reviews the current user wrote as own", async () => {
    mock.method(User, "findByPk", async () => businessTarget);
    mock.method(Review, "findAll", async () => [makeReview({ reviewerId: 1 })]);

    const req = { user: { id: 1 }, params: { targetId: "2" } };
    const res = createRes();
    const next = mockNext();

    await getTargetReviews(req, res, next);

    assert.equal(res.getBody().data.reviews[0].isOwn, true);
  });

  it("maps the current user's feedback to helpful or not_helpful", async () => {
    mock.method(User, "findByPk", async () => businessTarget);
    mock.method(Review, "findAll", async () => [
      makeReview({ feedbacks: [{ userId: 1, isHelpful: true }] }),
    ]);

    const req = { user: { id: 1 }, params: { targetId: "2" } };
    const res = createRes();
    const next = mockNext();

    await getTargetReviews(req, res, next);

    assert.equal(res.getBody().data.reviews[0].currentUserFeedback, "helpful");
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(User, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, params: { targetId: "2" } };
    const res = createRes();
    const next = mockNext();

    await getTargetReviews(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
