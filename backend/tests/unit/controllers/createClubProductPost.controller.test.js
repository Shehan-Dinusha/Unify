import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { createClubProductPost } from "../../../src/controllers/posts/createClubProductPost.controller.js";
import { ClubProductPost } from "../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = () => {
  let statusCode;
  let body;
  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      body = data;
      return res;
    },
    getStatusCode: () => statusCode,
    getBody: () => body,
  };
  return res;
};

describe("createClubProductPost", () => {
  it("returns 401 if unauthorized", async () => {
    const req = { body: {} }; // no user
    const res = createRes();

    await createClubProductPost(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.equal(res.getBody().success, false);
  });

  it("creates a club product post", async () => {
    const req = {
      user: { id: 1 },
      body: {
        name: "Test Product",
        price: 20,
        enableSizes: "true",
        sizes: JSON.stringify(["S", "M"]),
        colors: JSON.stringify(["Red"])
      },
      files: [{ location: "http://img.jpg" }]
    };
    const res = createRes();

    const createFn = mock.fn(async (data) => ({ ...data, id: 1 }));
    mock.method(ClubProductPost, "create", createFn);

    await createClubProductPost(req, res);

    assert.equal(res.getStatusCode(), 201);
    
    assert.equal(createFn.mock.calls.length, 1);
    const args = createFn.mock.calls[0].arguments[0];
    
    assert.equal(args.authorId, 1);
    assert.equal(args.name, "Test Product");
    assert.equal(args.enableSizes, true);
    assert.deepEqual(args.sizes, ["S", "M"]);
    assert.deepEqual(args.images, ["http://img.jpg"]);
  });
});
