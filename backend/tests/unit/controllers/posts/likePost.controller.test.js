import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { toggleLike } from "../../../../src/controllers/posts/likePost.controller.js";
import { NormalPost, PostLike, User } from "../../../../src/modules/index.js";
import Notification from "../../../../src/modules/Notification.model.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makePost = (overrides = {}) => ({
  id: 1,
  authorId: 2,
  likesCount: 3,
  title: "Cool post",
  async save() {},
  ...overrides,
});

describe("toggleLike", () => {
  it("returns 401 if the user is missing", async () => {
    const req = { params: { type: "normal", id: "1" } };
    const res = createRes();

    await toggleLike(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /Unauthorized/i);
  });

  it("returns 400 for an invalid post type", async () => {
    const req = { user: { id: 1 }, params: { type: "meme", id: "1" } };
    const res = createRes();

    await toggleLike(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Invalid post type/i);
  });

  it("returns 404 if the post is not found", async () => {
    mock.method(NormalPost, "findByPk", async () => null);

    const req = { user: { id: 1 }, params: { type: "normal", id: "999" } };
    const res = createRes();

    await toggleLike(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().error, /Post not found/i);
  });

  it("unlikes a post when a like already exists", async () => {
    mock.method(NormalPost, "findByPk", async () => makePost());
    mock.method(PostLike, "findOne", async () => ({
      destroy: async () => {},
    }));
    // removeLikeFromNotification calls Notification.findAll — resolve with empty so it's a no-op
    mock.method(Notification, "findAll", async () => []);

    const req = { user: { id: 1 }, params: { type: "normal", id: "1" } };
    const res = createRes();

    await toggleLike(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().liked, false);
    assert.equal(res.getBody().likesCount, 2);
  });

  it("removes the actor from the aggregated like notification on unlike", async () => {
    const save = mock.fn(async () => {});
    const existing = {
      content: JSON.stringify({ postType: "normal", users: [{ id: 1, name: "Alice" }, { id: 99, name: "Bob" }] }),
      title: "Alice and Bob liked your post",
      actorId: 1,
      save,
    };
    mock.method(NormalPost, "findByPk", async () => makePost());
    mock.method(PostLike, "findOne", async () => ({ destroy: async () => {} }));
    mock.method(Notification, "findAll", async () => [existing]);

    const req = { user: { id: 1 }, params: { type: "normal", id: "1" } };
    const res = createRes();

    await toggleLike(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().liked, false);
    // Notification should have been updated with Alice removed
    assert.equal(save.mock.calls.length, 1);
    const updatedData = JSON.parse(existing.content);
    assert.equal(updatedData.users.length, 1);
    assert.equal(updatedData.users[0].name, "Bob");
  });

  it("likes a post and increments the likes count", async () => {
    mock.method(NormalPost, "findByPk", async () => makePost());
    mock.method(PostLike, "findOne", async () => null);
    mock.method(PostLike, "create", async () => ({}));
    mock.method(User, "findByPk", async () => ({ name: "Alice" }));

    const req = { user: { id: 1 }, params: { type: "normal", id: "1" } };
    const res = createRes();

    await toggleLike(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().liked, true);
    assert.equal(res.getBody().likesCount, 4);
  });

  it("returns 500 on unexpected error", async () => {
    mock.method(NormalPost, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, params: { type: "normal", id: "1" } };
    const res = createRes();

    await toggleLike(req, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().error, "boom");
  });
});
