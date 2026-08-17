import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { toggleOwnerLike } from "../../../../src/controllers/review/toggleOwnerLike.controller.js";
import { Review } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeReview = (overrides = {}) => ({
  id: 1,
  reviewerId: 3,
  targetId: 2,
  isLikedByOwner: false,
  async save() {},
  ...overrides,
});

describe("toggleOwnerLike", () => {
  it("returns 404 if the review is not found", async () => {
    mock.method(Review, "findByPk", async () => null);

    const req = { user: { id: 2 }, params: { reviewId: "999" } };
    const res = createRes();
    const next = mockNext();

    await toggleOwnerLike(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Review not found/i);
  });

  it("returns 403 if the user is not the review target", async () => {
    mock.method(Review, "findByPk", async () => makeReview());

    const req = { user: { id: 99 }, params: { reviewId: "1" } };
    const res = createRes();
    const next = mockNext();

    await toggleOwnerLike(req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /Only the owner of this profile can like this review/i);
  });

  it("likes a review that was not liked", async () => {
    const save = mock.fn(async function () {});
    mock.method(Review, "findByPk", async () => makeReview({ isLikedByOwner: false, save }));

    const req = { user: { id: 2 }, params: { reviewId: "1" } };
    const res = createRes();
    const next = mockNext();

    await toggleOwnerLike(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().data.isLikedByOwner, true);
    assert.match(res.getBody().message, /liked/i);
    assert.equal(save.mock.calls.length, 1);
  });

  it("unlikes a review that was liked", async () => {
    const save = mock.fn(async function () {});
    mock.method(Review, "findByPk", async () => makeReview({ isLikedByOwner: true, save }));

    const req = { user: { id: 2 }, params: { reviewId: "1" } };
    const res = createRes();
    const next = mockNext();

    await toggleOwnerLike(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().data.isLikedByOwner, false);
    assert.match(res.getBody().message, /unliked/i);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(Review, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 2 }, params: { reviewId: "1" } };
    const res = createRes();
    const next = mockNext();

    await toggleOwnerLike(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
