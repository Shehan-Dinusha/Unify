import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { mockRes } from "../../../helpers/testUtils.js";
import { refreshToken } from "../../../../src/controllers/auth/refreshToken.controller.js";
import { User, UserSession } from "../../../../src/modules/index.js";
import { hashToken } from "../../../../src/controllers/auth/auth.utils.js";

process.env.JWT_SECRET = "test_secret";
process.env.JWT_REFRESH_SECRET = "refresh_secret_key";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("refreshToken controller (session-based)", () => {
  it("returns 400 if refresh token is missing", async () => {
    const req = { body: {} };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Refresh token is required/i);
  });

  it("returns 401 if the refresh token is invalid / expired JWT", async () => {
    const req = { body: { refreshToken: "bad-token" } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /Invalid refresh token/i);
  });

  it("returns 401 if session is not found in database (wrong hash)", async () => {
    const validJwt = jwt.sign({ id: 5 }, process.env.JWT_REFRESH_SECRET);
    mock.method(UserSession, "findOne", async () => null);

    const req = { body: { refreshToken: validJwt } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /Invalid refresh token/i);
  });

  it("returns 401 if session is revoked", async () => {
    const validJwt = jwt.sign({ id: 5 }, process.env.JWT_REFRESH_SECRET);
    // UserSession.findOne returns null when filtering by revokedAt: null
    mock.method(UserSession, "findOne", async () => null);

    const req = { body: { refreshToken: validJwt } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /Invalid refresh token/i);
  });

  it("returns 401 if user no longer exists or is suspended/deleted", async () => {
    const validJwt = jwt.sign({ id: 5 }, process.env.JWT_REFRESH_SECRET);
    const mockSession = {
      id: 10,
      userId: 5,
      tokenHash: hashToken(validJwt),
      update: mock.fn(async () => {}),
    };
    mock.method(UserSession, "findOne", async () => mockSession);
    mock.method(User, "findByPk", async () => ({ id: 5, status: "Suspended" }));

    const req = { body: { refreshToken: validJwt } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 401);
  });

  it("returns 200 and rotates token IN-PLACE on the same session row on success", async () => {
    const token = jwt.sign({ id: 5 }, process.env.JWT_REFRESH_SECRET);
    let updatedFields = null;
    const mockSession = {
      id: 10,
      userId: 5,
      tokenHash: hashToken(token),
      update: mock.fn(async (fields) => {
        updatedFields = fields;
      }),
    };
    mock.method(UserSession, "findOne", async () => mockSession);
    mock.method(User, "findByPk", async () => ({
      id: 5,
      role: "Student",
      status: "Active",
    }));

    const req = { body: { refreshToken: token } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.ok(res.getBody().data.accessToken);
    assert.ok(res.getBody().data.refreshToken);

    // Verify rotation occurred in the SAME session row
    assert.equal(mockSession.update.mock.calls.length, 1);
    assert.ok(updatedFields.tokenHash);
    assert.notEqual(updatedFields.tokenHash, hashToken(token)); // rotated
    assert.ok(updatedFields.expiresAt instanceof Date);
  });

  it("allows Session A and Session B to refresh independently without affecting each other", async () => {
    const tokenA = jwt.sign({ id: 5 }, process.env.JWT_REFRESH_SECRET);
    const tokenB = jwt.sign({ id: 5 }, process.env.JWT_REFRESH_SECRET);

    const sessionA = {
      id: 1,
      userId: 5,
      tokenHash: hashToken(tokenA),
      update: mock.fn(async (fields) => {
        sessionA.tokenHash = fields.tokenHash;
      }),
    };

    const sessionB = {
      id: 2,
      userId: 5,
      tokenHash: hashToken(tokenB),
      update: mock.fn(async (fields) => {
        sessionB.tokenHash = fields.tokenHash;
      }),
    };

    mock.method(User, "findByPk", async () => ({
      id: 5,
      role: "Student",
      status: "Active",
    }));

    // 1. Refresh Session A
    mock.method(UserSession, "findOne", async (opts) => {
      if (opts.where.tokenHash === hashToken(tokenA)) return sessionA;
      return null;
    });

    const resA = createRes();
    await refreshToken({ body: { refreshToken: tokenA } }, resA);
    assert.equal(resA.getStatusCode(), 200);
    assert.equal(sessionA.update.mock.calls.length, 1);
    assert.equal(sessionB.update.mock.calls.length, 0); // Session B untouched

    // 2. Refresh Session B
    mock.method(UserSession, "findOne", async (opts) => {
      if (opts.where.tokenHash === hashToken(tokenB)) return sessionB;
      return null;
    });

    const resB = createRes();
    await refreshToken({ body: { refreshToken: tokenB } }, resB);
    assert.equal(resB.getStatusCode(), 200);
    assert.equal(sessionB.update.mock.calls.length, 1); // Session B now updated
  });
});
