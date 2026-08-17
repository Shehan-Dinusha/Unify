import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext, runController } from "../../../helpers/testUtils.js";
import { getStudentFollowings } from "../../../../src/controllers/follower/getFollowing.controller.js";
import { User } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeFollowing = (overrides = {}) => ({
  id: 1,
  name: "Club A",
  avatar: null,
  clubProfile: { about: "A great club" },
  ...overrides,
});

const makeStudent = ({ total, getFollowingFn } = {}) => ({
  id: 1,
  role: "Student",
  async countFollowing() {
    return total;
  },
  getFollowing: getFollowingFn || (async () => []),
});

describe("getStudentFollowings", () => {
  it("returns 404 if the student does not exist", async () => {
    mock.method(User, "findByPk", async () => null);

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getStudentFollowings, req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Student not found/i);
  });

  it("returns 403 if the user is not a student", async () => {
    mock.method(User, "findByPk", async () => ({ id: 1, role: "Club" }));

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getStudentFollowings, req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /Only students can view their followings/i);
  });

  it("returns 200 with default sort ascending by name", async () => {
    const getFollowingFn = mock.fn(async () => [makeFollowing()]);
    mock.method(User, "findByPk", async () =>
      makeStudent({ total: 1, getFollowingFn }),
    );

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getStudentFollowings, req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const options = getFollowingFn.mock.calls[0].arguments[0];
    assert.deepEqual(options.order, [["name", "ASC"]]);
    assert.equal(options.limit, 10);
    assert.equal(options.offset, 0);
    assert.equal(res.getBody().data.followings[0].description, "A great club");
  });

  it("sorts descending by name when sortOrder is desc", async () => {
    const getFollowingFn = mock.fn(async () => []);
    mock.method(User, "findByPk", async () =>
      makeStudent({ total: 0, getFollowingFn }),
    );

    const req = { user: { id: 1 }, query: { sortOrder: "desc" } };
    const res = createRes();
    const next = mockNext();

    await runController(getStudentFollowings, req, res, next);

    const options = getFollowingFn.mock.calls[0].arguments[0];
    assert.deepEqual(options.order, [["name", "DESC"]]);
  });

  it("sorts by follow creation date for newest", async () => {
    const getFollowingFn = mock.fn(async () => []);
    mock.method(User, "findByPk", async () =>
      makeStudent({ total: 0, getFollowingFn }),
    );

    const req = { user: { id: 1 }, query: { sortOrder: "newest" } };
    const res = createRes();
    const next = mockNext();

    await runController(getStudentFollowings, req, res, next);

    const order = getFollowingFn.mock.calls[0].arguments[0].order;
    assert.equal(order[0][0].val, '"UserFollower"."createdAt"');
    assert.equal(order[0][1], "DESC");
  });

  it("sorts by follow creation date for oldest", async () => {
    const getFollowingFn = mock.fn(async () => []);
    mock.method(User, "findByPk", async () =>
      makeStudent({ total: 0, getFollowingFn }),
    );

    const req = { user: { id: 1 }, query: { sortOrder: "oldest" } };
    const res = createRes();
    const next = mockNext();

    await runController(getStudentFollowings, req, res, next);

    const order = getFollowingFn.mock.calls[0].arguments[0].order;
    assert.equal(order[0][0].val, '"UserFollower"."createdAt"');
    assert.equal(order[0][1], "ASC");
  });

  it("applies page and limit query params and computes hasMore", async () => {
    const getFollowingFn = mock.fn(async () => [makeFollowing(), makeFollowing({ id: 2 })]);
    mock.method(User, "findByPk", async () =>
      makeStudent({ total: 15, getFollowingFn }),
    );

    const req = { user: { id: 1 }, query: { limit: "2", page: "3" } };
    const res = createRes();
    const next = mockNext();

    await runController(getStudentFollowings, req, res, next);

    const options = getFollowingFn.mock.calls[0].arguments[0];
    assert.equal(options.limit, 2);
    assert.equal(options.offset, 4);
    assert.equal(res.getBody().data.total, 15);
    assert.equal(res.getBody().data.hasMore, true);
  });

  it("uses a fallback description when the club has no about text", async () => {
    const getFollowingFn = mock.fn(async () => [
      makeFollowing({ clubProfile: { about: null } }),
    ]);
    mock.method(User, "findByPk", async () =>
      makeStudent({ total: 1, getFollowingFn }),
    );

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getStudentFollowings, req, res, next);

    assert.equal(
      res.getBody().data.followings[0].description,
      "No description provided.",
    );
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(User, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await runController(getStudentFollowings, req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
