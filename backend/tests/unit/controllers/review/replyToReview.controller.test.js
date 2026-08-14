import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { replyToReview } from "../../../../src/controllers/review/replyToReview.controller.js";
import { Review } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeReview = (overrides = {}) => ({
  id: 1,
  reviewerId: 3,
  targetId: 2,
  ownerReply: null,
  updatedAt: new Date("2026-05-02T10:00:00Z"),
  async save() {
    this.updatedAt = new Date();
  },
  ...overrides,
});

describe("replyToReview", () => {
  it("returns 404 if the review is not found", async () => {
    mock.method(Review, "findByPk", async () => null);

    const req = { user: { id: 2, name: "Biz" }, params: { reviewId: "999" }, body: { content: "Thanks!" } };
    const res = createRes();
    const next = mockNext();

    await replyToReview(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Review not found/i);
  });

  it("returns 403 if the user is not the review target", async () => {
    mock.method(Review, "findByPk", async () => makeReview());

    const req = { user: { id: 99, name: "Intruder" }, params: { reviewId: "1" }, body: { content: "Thanks!" } };
    const res = createRes();
    const next = mockNext();

    await replyToReview(req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /Unauthorized. Only the owner of this profile can reply/i);
  });

  it("returns 200 and stores the trimmed reply", async () => {
    const save = mock.fn(async function () {});
    mock.method(Review, "findByPk", async () => makeReview({ save }));

    const req = { user: { id: 2, name: "Biz" }, params: { reviewId: "1" }, body: { content: "  Thanks for coming!  " } };
    const res = createRes();
    const next = mockNext();

    await replyToReview(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.equal(res.getBody().data.ownerReply.content, "Thanks for coming!");
    assert.equal(save.mock.calls.length, 1);
    assert.equal(next.called, false);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(Review, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 2 }, params: { reviewId: "1" }, body: { content: "Thanks!" } };
    const res = createRes();
    const next = mockNext();

    await replyToReview(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
