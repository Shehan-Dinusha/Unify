import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { togglePostVisibility } from "../../../../src/controllers/orders/togglePostVisibility.controller.js";
import { ClubProductPost, ClubEventPost } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makePost = (overrides = {}) => ({
  id: 1,
  isVisible: false,
  async update(data) {
    this.isVisible = data.isVisible;
    return this;
  },
  ...overrides,
});

describe("togglePostVisibility", () => {
  it("returns 400 for an invalid post type", async () => {
    const req = { params: { type: "meme", postId: "1" } };
    const res = createRes();

    await togglePostVisibility(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Invalid post type/i);
  });

  it("returns 404 if the post is not found", async () => {
    mock.method(ClubProductPost, "findByPk", async () => null);

    const req = { params: { type: "club-product", postId: "999" } };
    const res = createRes();

    await togglePostVisibility(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().error, /Post not found/i);
  });

  it("toggles visibility of a club product post", async () => {
    mock.method(ClubProductPost, "findByPk", async () => makePost());

    const req = { params: { type: "club-product", postId: "1" } };
    const res = createRes();

    await togglePostVisibility(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.equal(res.getBody().postId, 1);
    assert.equal(res.getBody().isVisible, true);
  });

  it("toggles visibility of a club event post", async () => {
    mock.method(ClubEventPost, "findByPk", async () => makePost());

    const req = { params: { type: "club-event", postId: "1" } };
    const res = createRes();

    await togglePostVisibility(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().isVisible, true);
  });

  it("returns 500 on unexpected error", async () => {
    mock.method(ClubProductPost, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { params: { type: "club-product", postId: "1" } };
    const res = createRes();

    await togglePostVisibility(req, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().error, "boom");
  });
});
