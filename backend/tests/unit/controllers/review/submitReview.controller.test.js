import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { submitReview } from "../../../../src/controllers/review/submitReview.controller.js";
import { Review, User } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const reviewer = { id: 1, name: "Alice", role: "Student" };
const businessTarget = { id: 2, name: "Biz", role: "Business" };

describe("submitReview", () => {
  it("returns 404 if the reviewer does not exist", async () => {
    mock.method(User, "findByPk", async () => null);

    const req = {
      user: { id: 1, name: "Alice" },
      body: { targetId: 2, rating: 5, review: "Great!" },
    };
    const res = createRes();
    const next = mockNext();

    await submitReview(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /Reviewer not found/i);
  });

  it("returns 403 if the reviewer is not a Student or Club", async () => {
    mock.method(User, "findByPk", async () => ({ id: 1, role: "Business" }));

    const req = {
      user: { id: 1 },
      body: { targetId: 2, rating: 5, review: "Great!" },
    };
    const res = createRes();
    const next = mockNext();

    await submitReview(req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /Only Students and Clubs can submit reviews/i);
  });

  it("returns 404 if the target user does not exist", async () => {
    mock.method(User, "findByPk", async (id) => (id === 1 ? reviewer : null));

    const req = {
      user: { id: 1, name: "Alice" },
      body: { targetId: 999, rating: 5, review: "Great!" },
    };
    const res = createRes();
    const next = mockNext();

    await submitReview(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Target user not found/i);
  });

  it("returns 400 if the target is not a Business account", async () => {
    mock.method(User, "findByPk", async (id) => (id === 1 ? reviewer : { id: 2, role: "Student" }));

    const req = {
      user: { id: 1, name: "Alice" },
      body: { targetId: 2, rating: 5, review: "Great!" },
    };
    const res = createRes();
    const next = mockNext();

    await submitReview(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Reviews can only be given to Business accounts/i);
  });

  it("returns 400 if the reviewer already reviewed the target", async () => {
    mock.method(User, "findByPk", async (id) => (id === 1 ? reviewer : businessTarget));
    mock.method(Review, "findOne", async () => ({ id: 9 }));

    const req = {
      user: { id: 1, name: "Alice" },
      body: { targetId: 2, rating: 5, review: "Great!" },
    };
    const res = createRes();
    const next = mockNext();

    await submitReview(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /already have an active review/i);
  });

  it("returns 201 and creates the review with defaults", async () => {
    mock.method(User, "findByPk", async (id) => (id === 1 ? reviewer : businessTarget));
    mock.method(Review, "findOne", async () => null);
    const createFn = mock.fn(async (data) => ({ id: 10, ...data }));
    mock.method(Review, "create", createFn);

    const req = {
      user: { id: 1, name: "Alice" },
      body: { targetId: 2, rating: 4 },
    };
    const res = createRes();
    const next = mockNext();

    await submitReview(req, res, next);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(res.getBody().success, true);
    const args = createFn.mock.calls[0].arguments[0];
    assert.equal(args.reviewerId, 1);
    assert.equal(args.targetId, 2);
    assert.equal(args.rating, 4);
    assert.equal(args.content, "");
    assert.equal(args.isAnonymous, false);
    assert.equal(next.called, false);
  });

  it("returns 201 and stores content and anonymity flags", async () => {
    mock.method(User, "findByPk", async (id) => (id === 1 ? reviewer : businessTarget));
    mock.method(Review, "findOne", async () => null);
    const createFn = mock.fn(async (data) => ({ id: 11, ...data }));
    mock.method(Review, "create", createFn);

    const req = {
      user: { id: 1, name: "Alice" },
      body: { targetId: 2, rating: 3, review: "Meh", isAnonymous: true },
    };
    const res = createRes();
    const next = mockNext();

    await submitReview(req, res, next);

    assert.equal(res.getStatusCode(), 201);
    const args = createFn.mock.calls[0].arguments[0];
    assert.equal(args.content, "Meh");
    assert.equal(args.isAnonymous, true);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(User, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = {
      user: { id: 1 },
      body: { targetId: 2, rating: 5 },
    };
    const res = createRes();
    const next = mockNext();

    await submitReview(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
    assert.equal(res.getStatusCode(), null);
  });
});
