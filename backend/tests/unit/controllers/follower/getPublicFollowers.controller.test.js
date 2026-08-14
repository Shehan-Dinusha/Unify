import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext, runController } from "../../../helpers/testUtils.js";
import { getPublicFollowers } from "../../../../src/controllers/follower/getPublicFollowers.controller.js";
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

const makeClub = ({ total, getFollowersFn } = {}) => ({
  id: 2,
  role: "Club",
  async countFollowers() {
    return total;
  },
  getFollowers: getFollowersFn || (async () => []),
});

describe("getPublicFollowers", () => {
  it("returns 404 if the target user does not exist", async () => {
    mock.method(User, "findByPk", async () => null);

    const req = { user: { id: 9 }, params: { userId: "999" }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getPublicFollowers, req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /User not found/i);
  });

  it("returns 403 if the target is not a club", async () => {
    mock.method(User, "findByPk", async () => ({ id: 2, role: "Student" }));

    const req = { user: { id: 9 }, params: { userId: "2" }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getPublicFollowers, req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /Only clubs can have followers/i);
  });

  it("returns 200 with default pagination", async () => {
    const getFollowersFn = mock.fn(async () => [makeFollower()]);
    mock.method(User, "findByPk", async () =>
      makeClub({ total: 1, getFollowersFn }),
    );

    const req = { user: { id: 9 }, params: { userId: "2" }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getPublicFollowers, req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const options = getFollowersFn.mock.calls[0].arguments[0];
    assert.equal(options.limit, 20);
    assert.equal(options.offset, 0);
    assert.equal(res.getBody().data.followers[0].name, "Follower");
    assert.equal(res.getBody().data.total, 1);
    assert.equal(res.getBody().data.hasMore, false);
  });

  it("applies limit and page query params", async () => {
    const getFollowersFn = mock.fn(async () => [makeFollower(), makeFollower({ id: 2 })]);
    mock.method(User, "findByPk", async () =>
      makeClub({ total: 10, getFollowersFn }),
    );

    const req = { user: { id: 9 }, params: { userId: "2" }, query: { limit: "2", page: "2" } };
    const res = createRes();
    const next = mockNext();

    await runController(getPublicFollowers, req, res, next);

    const options = getFollowersFn.mock.calls[0].arguments[0];
    assert.equal(options.limit, 2);
    assert.equal(options.offset, 2);
    assert.equal(res.getBody().data.hasMore, true);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(User, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 9 }, params: { userId: "2" }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getPublicFollowers, req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
