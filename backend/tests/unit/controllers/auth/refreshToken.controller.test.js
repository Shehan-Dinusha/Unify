import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { mockRes } from "../../../helpers/testUtils.js";
import { refreshToken } from "../../../../src/controllers/auth/refreshToken.controller.js";
import { User } from "../../../../src/modules/index.js";

process.env.JWT_SECRET = "test_secret";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("refreshToken", () => {
  it("returns 400 if refresh token is missing", async () => {
    const req = { body: {} };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Refresh token is required/i);
  });

  it("returns 401 if the refresh token is invalid", async () => {
    mock.method(jwt, "verify", () => {
      throw new Error("jwt expired");
    });

    const req = { body: { refreshToken: "bad-token" } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /Invalid refresh token/i);
  });

  it("returns 401 if the user no longer exists", async () => {
    mock.method(jwt, "verify", () => ({ id: 5 }));
    mock.method(User, "findByPk", async () => null);

    const req = { body: { refreshToken: "valid-token" } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /Invalid refresh token/i);
  });

  it("returns 401 if the stored token does not match", async () => {
    mock.method(jwt, "verify", () => ({ id: 5 }));
    mock.method(User, "findByPk", async () => ({ id: 5, refreshToken: "stored-token" }));

    const req = { body: { refreshToken: "different-token" } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /Invalid refresh token/i);
  });

  it("returns 200 with fresh tokens on success", async () => {
    mock.method(jwt, "verify", () => ({ id: 5 }));
    mock.method(User, "findByPk", async () => ({
      id: 5,
      refreshToken: "valid-token",
      async save() {},
    }));

    const req = { body: { refreshToken: "valid-token" } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.ok(res.getBody().data.accessToken);
    assert.ok(res.getBody().data.refreshToken);
  });

  it("returns 500 on unexpected error", async () => {
    mock.method(jwt, "verify", () => ({ id: 5 }));
    mock.method(User, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { body: { refreshToken: "valid-token" } };
    const res = createRes();

    await refreshToken(req, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().message, "Internal Server Error");
  });
});
