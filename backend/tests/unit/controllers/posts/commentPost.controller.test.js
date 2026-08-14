import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { addComment, getComments } from "../../../../src/controllers/posts/commentPost.controller.js";
import { NormalPost, Comment, User } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makePost = (overrides = {}) => ({
  id: 1,
  authorId: 2,
  ...overrides,
});

describe("addComment", () => {
  it("returns 401 if the user is missing", async () => {
    const req = { params: { type: "normal", id: "1" }, body: { content: "nice" } };
    const res = createRes();

    await addComment(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /Unauthorized/i);
  });

  it("returns 400 if the comment content is missing", async () => {
    const req = { user: { id: 1 }, params: { type: "normal", id: "1" }, body: {} };
    const res = createRes();

    await addComment(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Comment content is required/i);
  });

  it("returns 400 if the comment content is blank", async () => {
    const req = { user: { id: 1 }, params: { type: "normal", id: "1" }, body: { content: "   " } };
    const res = createRes();

    await addComment(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Comment content is required/i);
  });

  it("returns 400 for an invalid post type", async () => {
    const req = { user: { id: 1 }, params: { type: "meme", id: "1" }, body: { content: "nice" } };
    const res = createRes();

    await addComment(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Invalid post type/i);
  });

  it("returns 404 if the post is not found", async () => {
    mock.method(NormalPost, "findByPk", async () => null);

    const req = { user: { id: 1 }, params: { type: "normal", id: "999" }, body: { content: "nice" } };
    const res = createRes();

    await addComment(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().error, /Post not found/i);
  });

  it("returns 201 and creates the comment with trimmed content", async () => {
    mock.method(NormalPost, "findByPk", async () => makePost());
    const createFn = mock.fn(async (data) => ({ id: 10, ...data }));
    mock.method(Comment, "create", createFn);
    mock.method(Comment, "findByPk", async () => ({ id: 10, content: "nice" }));
    mock.method(User, "findByPk", async () => ({ name: "Alice" }));

    const req = { user: { id: 1 }, params: { type: "normal", id: "1" }, body: { content: "  nice  " } };
    const res = createRes();

    await addComment(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(res.getBody().success, true);
    assert.equal(createFn.mock.calls[0].arguments[0].content, "nice");
    assert.equal(createFn.mock.calls[0].arguments[0].userId, 1);
    assert.equal(createFn.mock.calls[0].arguments[0].postType, "normal");
  });

  it("returns 500 on unexpected error", async () => {
    mock.method(NormalPost, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, params: { type: "normal", id: "1" }, body: { content: "nice" } };
    const res = createRes();

    await addComment(req, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().error, "boom");
  });
});

describe("getComments", () => {
  it("returns 200 with the post comments", async () => {
    mock.method(Comment, "findAll", async () => [{ id: 1, content: "first" }, { id: 2, content: "second" }]);

    const req = { params: { type: "normal", id: "1" } };
    const res = createRes();

    await getComments(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.equal(res.getBody().comments.length, 2);
  });

  it("returns 400 for an invalid post type", async () => {
    const req = { params: { type: "meme", id: "1" } };
    const res = createRes();

    await getComments(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Invalid post type/i);
  });
});
