import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { mockRes } from "../../../helpers/testUtils.js";
import { logout, logoutAll } from "../../../../src/controllers/auth/logout.controller.js";
import { UserSession } from "../../../../src/modules/index.js";
import { hashToken } from "../../../../src/controllers/auth/auth.utils.js";

process.env.JWT_REFRESH_SECRET = "refresh_secret_key";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("logout & logoutAll controllers", () => {
  describe("logout", () => {
    it("returns 200 even if no refresh token is provided", async () => {
      const req = { body: {} };
      const res = createRes();

      await logout(req, res);

      assert.equal(res.getStatusCode(), 200);
      assert.equal(res.getBody().success, true);
    });

    it("returns 200 if invalid refresh token is provided (idempotent)", async () => {
      const req = { body: { refreshToken: "invalid-token" } };
      const res = createRes();

      await logout(req, res);

      assert.equal(res.getStatusCode(), 200);
      assert.equal(res.getBody().success, true);
    });

    it("revokes only the specific session matching the refresh token", async () => {
      const token = jwt.sign({ id: 5 }, process.env.JWT_REFRESH_SECRET);
      let updateWhere = null;
      mock.method(UserSession, "update", async (fields, opts) => {
        updateWhere = opts.where;
        return [1];
      });

      const req = { body: { refreshToken: token } };
      const res = createRes();

      await logout(req, res);

      assert.equal(res.getStatusCode(), 200);
      assert.equal(res.getBody().success, true);
      assert.equal(updateWhere.userId, 5);
      assert.equal(updateWhere.tokenHash, hashToken(token));
      assert.equal(updateWhere.revokedAt, null);
    });
  });

  describe("logoutAll", () => {
    it("revokes all active sessions for the authenticated user", async () => {
      let updateWhere = null;
      mock.method(UserSession, "update", async (fields, opts) => {
        updateWhere = opts.where;
        return [3]; // 3 sessions revoked
      });

      const req = { user: { id: 42 } };
      const res = createRes();

      await logoutAll(req, res);

      assert.equal(res.getStatusCode(), 200);
      assert.equal(res.getBody().success, true);
      assert.equal(updateWhere.userId, 42);
      assert.equal(updateWhere.revokedAt, null);
    });
  });
});
