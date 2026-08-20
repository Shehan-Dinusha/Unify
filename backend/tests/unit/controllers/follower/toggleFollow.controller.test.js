import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext, runController } from "../../../helpers/testUtils.js";
import { toggleFollowClub } from "../../../../src/controllers/follower/toggleFollow.controller.js";
import { User, UserFollower, ClubProfile } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const student = { id: 1, name: "Alice", role: "Student" };
const verifiedClub = { id: 2, role: "Club" };

describe("toggleFollowClub", () => {
  it("returns 404 if the follower user does not exist", async () => {
    mock.method(User, "findByPk", async () => null);

    const req = { user: { id: 1 }, params: { clubId: "2" } };
    const res = createRes();
    const next = mockNext();

    await runController(toggleFollowClub, req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /User not found/i);
  });

  it("returns 403 if the follower is not a student", async () => {
    mock.method(User, "findByPk", async () => ({ id: 1, role: "Club" }));

    const req = { user: { id: 1 }, params: { clubId: "2" } };
    const res = createRes();
    const next = mockNext();

    await runController(toggleFollowClub, req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /Only students can follow clubs/i);
  });

  it("returns 404 if the target club does not exist", async () => {
    mock.method(User, "findByPk", async (id) => (id === 1 ? student : null));

    const req = { user: { id: 1, name: "Alice" }, params: { clubId: "999" } };
    const res = createRes();
    const next = mockNext();

    await runController(toggleFollowClub, req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Target club not found/i);
  });

  it("returns 403 if the target is not a club", async () => {
    mock.method(User, "findByPk", async (id) => (id === 1 ? student : { id: 2, role: "Student" }));

    const req = { user: { id: 1, name: "Alice" }, params: { clubId: "2" } };
    const res = createRes();
    const next = mockNext();

    await runController(toggleFollowClub, req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /You can only follow clubs/i);
  });

  it("returns 403 if the club is not verified", async () => {
    mock.method(User, "findByPk", async (id) => (id === 1 ? student : verifiedClub));
    mock.method(ClubProfile, "findOne", async () => null);

    const req = { user: { id: 1, name: "Alice" }, params: { clubId: "2" } };
    const res = createRes();
    const next = mockNext();

    await runController(toggleFollowClub, req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /You can only follow verified clubs/i);
  });

  it("returns 201 and creates a new follow relationship", async () => {
    mock.method(User, "findByPk", async (id) => (id === 1 ? student : verifiedClub));
    mock.method(ClubProfile, "findOne", async () => ({ isVerified: true }));
    mock.method(UserFollower, "findOne", async () => null);
    const createFn = mock.fn(async (data) => ({ id: 10, ...data }));
    mock.method(UserFollower, "create", createFn);

    const req = { user: { id: 1, name: "Alice" }, params: { clubId: "2" } };
    const res = createRes();
    const next = mockNext();

    await runController(toggleFollowClub, req, res, next);

    assert.equal(res.getStatusCode(), 201);
    assert.match(res.getBody().message, /Successfully followed the club/i);
    const args = createFn.mock.calls[0].arguments[0];
    assert.equal(args.followerId, 1);
    assert.equal(args.followingId, "2");
    assert.equal(next.called, false);
  });

  it("returns 200 and destroys the follow relationship on unfollow", async () => {
    const destroy = mock.fn(async () => {});
    mock.method(User, "findByPk", async (id) => (id === 1 ? student : verifiedClub));
    mock.method(ClubProfile, "findOne", async () => ({ isVerified: true }));
    mock.method(UserFollower, "findOne", async () => ({ id: 5, destroy }));

    const req = { user: { id: 1, name: "Alice" }, params: { clubId: "2" } };
    const res = createRes();
    const next = mockNext();

    await runController(toggleFollowClub, req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.match(res.getBody().message, /Successfully unfollowed the club/i);
    assert.equal(destroy.mock.calls.length, 1);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(User, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, params: { clubId: "2" } };
    const res = createRes();
    const next = mockNext();

    await runController(toggleFollowClub, req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
