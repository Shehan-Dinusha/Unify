import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { deleteReview } from "../../../../src/controllers/review/deleteReview.controller.js";
import { Review } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeReview = (overrides = {}) => ({
  id: 1,
  reviewerId: 5,
  async destroy() {},
  ...overrides,
});

describe("deleteReview", () => {
  it("returns 404 if the review is not found", async () => {
    mock.method(Review, "findByPk", async () => null);

    const req = { user: { id: 5 }, params: { id: "999" } };
    const res = createRes();
    const next = mockNext();

    await deleteReview(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Review not found/i);
  });

  it("returns 403 if the user is not the review author", async () => {
    mock.method(Review, "findByPk", async () => makeReview());

    const req = { user: { id: 99 }, params: { id: "1" } };
    const res = createRes();
    const next = mockNext();

    await deleteReview(req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /You can only delete your own reviews/i);
  });

  it("returns 200 and destroys the review", async () => {
    const destroy = mock.fn(async () => {});
    mock.method(Review, "findByPk", async () => makeReview({ destroy }));

    const req = { user: { id: 5 }, params: { id: "1" } };
    const res = createRes();
    const next = mockNext();

    await deleteReview(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.equal(destroy.mock.calls.length, 1);
    assert.equal(next.called, false);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(Review, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 5 }, params: { id: "1" } };
    const res = createRes();
    const next = mockNext();

    await deleteReview(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
