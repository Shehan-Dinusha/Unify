import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { createNormalPost } from "../../../../src/controllers/posts/createNormalPost.controller.js";
import { NormalPost } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("createNormalPost", () => {
  it("returns 401 if the user is missing", async () => {
    const req = { body: { description: "hello" } };
    const res = createRes();

    await createNormalPost(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /Unauthorized/i);
  });

  it("defaults the category to CLUB", async () => {
    const createFn = mock.fn(async (data) => ({ id: 1, ...data }));
    mock.method(NormalPost, "create", createFn);

    const req = { user: { id: 1 }, body: { description: "hello" } };
    const res = createRes();

    await createNormalPost(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(createFn.mock.calls[0].arguments[0].category, "CLUB");
  });

  it("maps food-cafe post type to FOOD", async () => {
    const createFn = mock.fn(async (data) => ({ id: 1, ...data }));
    mock.method(NormalPost, "create", createFn);

    const req = { user: { id: 1 }, body: { description: "lunch", postType: "food-cafe" } };
    const res = createRes();

    await createNormalPost(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(createFn.mock.calls[0].arguments[0].category, "FOOD");
  });

  it("maps service post type to SELF_EMPLOYED", async () => {
    const createFn = mock.fn(async (data) => ({ id: 1, ...data }));
    mock.method(NormalPost, "create", createFn);

    const req = { user: { id: 1 }, body: { description: "tutoring", postType: "service" } };
    const res = createRes();

    await createNormalPost(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(createFn.mock.calls[0].arguments[0].category, "SELF_EMPLOYED");
  });

  it("keeps the provided category for other post types", async () => {
    const createFn = mock.fn(async (data) => ({ id: 1, ...data }));
    mock.method(NormalPost, "create", createFn);

    const req = {
      user: { id: 1 },
      body: { description: "society", postType: "community", category: "SOCIETY" },
    };
    const res = createRes();

    await createNormalPost(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(createFn.mock.calls[0].arguments[0].category, "SOCIETY");
  });

  it("stores the uploaded image URLs", async () => {
    const createFn = mock.fn(async (data) => ({ id: 1, ...data }));
    mock.method(NormalPost, "create", createFn);

    const req = {
      user: { id: 1 },
      body: { description: "with pics" },
      files: [{ location: "https://cdn.example.com/a.png" }, { location: "https://cdn.example.com/b.png" }],
    };
    const res = createRes();

    await createNormalPost(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.deepEqual(createFn.mock.calls[0].arguments[0].images, [
      "https://cdn.example.com/a.png",
      "https://cdn.example.com/b.png",
    ]);
  });

  it("returns 500 on unexpected error", async () => {
    mock.method(NormalPost, "create", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, body: { description: "hello" } };
    const res = createRes();

    await createNormalPost(req, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().error, "boom");
  });
});
