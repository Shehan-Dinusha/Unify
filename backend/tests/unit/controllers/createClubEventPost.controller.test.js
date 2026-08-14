import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { createClubEventPost } from "../../../src/controllers/posts/createClubEventPost.controller.js";
import { ClubProfile, ClubEventPost } from "../../../src/modules/index.js";

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

describe("createClubEventPost", () => {
  it("returns 400 if user ID is missing", async () => {
    const req = { body: {} };
    const res = createRes();

    await createClubEventPost(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /User ID is required/i);
  });

  it("creates a dummy club profile if none exists, then creates the event post", async () => {
    const req = {
      user: { id: 1 },
      body: {
        name: "Test Event",
        price: 50,
        tiers: JSON.stringify([{ isFree: false, price: 50 }])
      },
      files: [{ location: "http://image1.jpg" }]
    };
    const res = createRes();

    mock.method(ClubProfile, "findOne", async () => null);
    
    const profileCreateFn = mock.fn(async (data) => data);
    mock.method(ClubProfile, "create", profileCreateFn);

    const postCreateFn = mock.fn(async (data) => ({ ...data, id: 100 }));
    mock.method(ClubEventPost, "create", postCreateFn);

    await createClubEventPost(req, res);

    assert.equal(res.getStatusCode(), 201);
    
    assert.equal(profileCreateFn.mock.calls.length, 1);
    assert.equal(postCreateFn.mock.calls.length, 1);

    const postArgs = postCreateFn.mock.calls[0].arguments[0];
    assert.equal(postArgs.authorId, 1);
    assert.equal(postArgs.name, "Test Event");
    assert.equal(postArgs.price, 50); // derived from tiers
    assert.equal(postArgs.coverImage[0].url, "http://image1.jpg");
  });
});
