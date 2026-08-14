import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { getReceivedReviews } from "../../../../src/controllers/review/getReceivedReviews.controller.js";
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
    rating: 4,
    content: "Nice",
    helpfulCount: 1,
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
    target: {
      id: 2,
      name: "Biz",
      role: "Business",
      avatar: null,
      businessProfile: { businessName: "ABC Shop", displayName: "ABC" },
    },
    ...overrides,
  };
  return { ...row, toJSON: () => ({ ...row }) };
};

const businessTarget = { id: 2, name: "Biz", role: "Business" };

describe("getReceivedReviews", () => {
  it("returns 404 if the target user does not exist", async () => {
    mock.method(User, "findByPk", async () => null);

    const req = { user: { id: 2 } };
    const res = createRes();
    const next = mockNext();

    await getReceivedReviews(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Target user not found/i);
  });

  it("returns 400 if the user is not a Business account", async () => {
    mock.method(User, "findByPk", async () => ({ id: 2, role: "Student" }));

    const req = { user: { id: 2 } };
    const res = createRes();
    const next = mockNext();

    await getReceivedReviews(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Only Business accounts can view received reviews/i);
  });

  it("returns 200 with formatted reviews and a business name", async () => {
    mock.method(User, "findByPk", async () => businessTarget);
    mock.method(Review, "findAll", async () => [makeReview()]);

    const req = { user: { id: 2 } };
    const res = createRes();
    const next = mockNext();

    await getReceivedReviews(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const body = res.getBody();
    assert.equal(body.success, true);
    assert.equal(body.data.summary.totalReviews, 1);
    assert.equal(body.data.summary.averageRating, "4.0");
    assert.equal(body.data.reviews[0].businessName, "ABC Shop");
    assert.equal(body.data.reviews[0].author.name, "Alice");
    assert.equal(body.data.reviews[0].hasOwnerReplied, false);
  });

  it("sets hasOwnerReplied when an owner reply exists", async () => {
    mock.method(User, "findByPk", async () => businessTarget);
    mock.method(Review, "findAll", async () => [makeReview({ ownerReply: "Thanks!" })]);

    const req = { user: { id: 2 } };
    const res = createRes();
    const next = mockNext();

    await getReceivedReviews(req, res, next);

    const review = res.getBody().data.reviews[0];
    assert.equal(review.hasOwnerReplied, true);
    assert.equal(review.ownerReply.content, "Thanks!");
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(User, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 2 } };
    const res = createRes();
    const next = mockNext();

    await getReceivedReviews(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
