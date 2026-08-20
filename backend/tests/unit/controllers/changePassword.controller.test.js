import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { User } from "../../../src/modules/index.js";
import { changePassword } from "../../../src/controllers/profile/changePassword.controller.js";

afterEach(() => {
  mock.restoreAll();
});

/**
 * Helper to create a mock Express response.
 */
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

describe("changePassword", () => {
  it("returns 404 when user is not found", async () => {
    const req = {
      user: { id: 999 },
      body: { currentPassword: "OldPass123!", newPassword: "NewPass456!" },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => null);

    await changePassword(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /not found/i);
  });

  it("returns 400 when current password is incorrect", async () => {
    const req = {
      user: { id: 1 },
      body: { currentPassword: "WrongPassword!", newPassword: "NewPass456!" },
    };
    const res = createRes();

    // Hash a known password to simulate the stored hash
    const correctHash = await bcrypt.hash("CorrectPassword!", 10);

    mock.method(User, "findByPk", async () => ({
      id: 1,
      passwordHash: correctHash,
      update: mock.fn(async () => {}),
    }));

    await changePassword(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /incorrect/i);
  });

  it("returns 200 and updates password on success", async () => {
    const currentPassword = "OldPass123!";
    const newPassword = "NewPass456!";

    const currentHash = await bcrypt.hash(currentPassword, 10);

    const updateFn = mock.fn(async () => {});

    mock.method(User, "findByPk", async () => ({
      id: 1,
      passwordHash: currentHash,
      update: updateFn,
    }));

    const req = {
      user: { id: 1 },
      body: { currentPassword, newPassword },
    };
    const res = createRes();

    await changePassword(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.match(res.getBody().message, /updated/i);
    assert.equal(updateFn.mock.calls.length, 1);

    // Verify the new hash was passed to update()
    const updateArg = updateFn.mock.calls[0].arguments[0];
    assert.ok(updateArg.passwordHash);
    // Verify the new hash matches the new password
    const matches = await bcrypt.compare(newPassword, updateArg.passwordHash);
    assert.equal(matches, true);
  });

  it("does not update password when current password check fails", async () => {
    const currentHash = await bcrypt.hash("CorrectPassword!", 10);
    const updateFn = mock.fn(async () => {});

    mock.method(User, "findByPk", async () => ({
      id: 1,
      passwordHash: currentHash,
      update: updateFn,
    }));

    const req = {
      user: { id: 1 },
      body: { currentPassword: "WrongPassword!", newPassword: "NewPass456!" },
    };
    const res = createRes();

    await changePassword(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.equal(updateFn.mock.calls.length, 0);
  });
});
