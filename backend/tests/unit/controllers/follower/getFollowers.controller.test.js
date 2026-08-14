import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext, runController } from "../../../helpers/testUtils.js";
import { getClubFollowers } from "../../../../src/controllers/follower/getFollowers.controller.js";
import { User } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeFollower = (overrides = {}) => ({
  id: 1,
  name: "Follower",
  role: "Student",
  avatar: null,
  ...overrides,
});

const makeClub = ({ total, followers, getFollowersFn } = {}) => ({
  id: 2,
  role: "Club",
  async countFollowers() {
    return total;
  },
  getFollowers: getFollowersFn || (async () => followers || []),
});

describe("getClubFollowers", () => {
  it("returns 404 if the club does not exist", async () => {
    mock.method(User, "findByPk", async () => null);

    const req = { user: { id: 2 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getClubFollowers, req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Club not found/i);
  });

  it("returns 403 if the user is not a club", async () => {
    mock.method(User, "findByPk", async () => ({ id: 2, role: "Student" }));

    const req = { user: { id: 2 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getClubFollowers, req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /Only clubs can have followers listed/i);
  });

  it("returns 200 with default pagination and hasMore", async () => {
    const getFollowersFn = mock.fn(async () => [
      makeFollower({ id: 1 }),
      makeFollower({ id: 2, name: "Bob" }),
    ]);
    mock.method(User, "findByPk", async () =>
      makeClub({ total: 14, getFollowersFn }),
    );

    const req = { user: { id: 2 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getClubFollowers, req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const body = res.getBody();
    assert.equal(body.success, true);
    assert.equal(body.data.total, 14);
    assert.equal(body.data.hasMore, true);
    assert.equal(body.data.followers.length, 2);
    assert.equal(body.data.followers[0].name, "Follower");
    assert.equal(body.data.followers[0].role, "Student");
    const options = getFollowersFn.mock.calls[0].arguments[0];
    assert.equal(options.limit, 14);
    assert.equal(options.offset, 0);
  });

  it("returns hasMore false when all followers are loaded", async () => {
    mock.method(User, "findByPk", async () =>
      makeClub({ total: 1, followers: [makeFollower()] }),
    );

    const req = { user: { id: 2 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getClubFollowers, req, res, next);

    assert.equal(res.getBody().data.hasMore, false);
  });

  it("applies page and limit query params", async () => {
    const getFollowersFn = mock.fn(async () => [makeFollower()]);
    mock.method(User, "findByPk", async () =>
      makeClub({ total: 20, getFollowersFn }),
    );

    const req = { user: { id: 2 }, query: { limit: "5", page: "3" } };
    const res = createRes();
    const next = mockNext();

    await runController(getClubFollowers, req, res, next);

    const options = getFollowersFn.mock.calls[0].arguments[0];
    assert.equal(options.limit, 5);
    assert.equal(options.offset, 10);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(User, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 2 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getClubFollowers, req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
