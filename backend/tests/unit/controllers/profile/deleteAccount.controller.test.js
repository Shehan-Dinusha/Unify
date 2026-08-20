import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { mockRes } from "../../../helpers/testUtils.js";
import { User, UserSession } from "../../../../src/modules/index.js";
import { deleteAccount } from "../../../../src/controllers/profile/deleteAccount.controller.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("deleteAccount", () => {
  it("returns 400 when password is not provided", async () => {
    const req = {
      user: { id: 1 },
      body: {},
    };
    const res = createRes();

    await deleteAccount(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /password is required/i);
  });

  it("returns 404 when user is not found in the database", async () => {
    const req = {
      user: { id: 999 },
      body: { password: "SomePass123!" },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => null);

    await deleteAccount(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /not found/i);
  });

  it("returns 401 when password is incorrect", async () => {
    const correctHash = await bcrypt.hash("CorrectPassword!", 10);

    mock.method(User, "findByPk", async () => ({
      id: 1,
      passwordHash: correctHash,
      update: mock.fn(async () => {}),
    }));

    const req = {
      user: { id: 1 },
      body: { password: "WrongPassword!" },
    };
    const res = createRes();

    await deleteAccount(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /incorrect/i);
  });

  it("returns 200 and soft-deletes the account on success", async () => {
    const password = "CorrectPassword!";
    const passwordHash = await bcrypt.hash(password, 10);
    const updateFn = mock.fn(async () => {});
    const destroyFn = mock.fn(async () => {});

    mock.method(User, "findByPk", async () => ({
      id: 1,
      passwordHash,
      update: updateFn,
    }));
    mock.method(UserSession, "destroy", destroyFn);

    const req = {
      user: { id: 1 },
      body: { password },
    };
    const res = createRes();

    await deleteAccount(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.match(res.getBody().message, /deleted/i);
    assert.equal(updateFn.mock.calls.length, 1);
    assert.equal(destroyFn.mock.calls.length, 1);
    assert.deepEqual(destroyFn.mock.calls[0].arguments[0], {
      where: { userId: 1 },
    });

    // Verify the anonymization data passed to update()
    const updateArg = updateFn.mock.calls[0].arguments[0];
    assert.equal(updateArg.name, "Deleted User");
    assert.equal(updateArg.email, null);
    assert.equal(updateArg.phone, null);
    assert.equal(updateArg.avatar, null);
    assert.equal(updateArg.status, "Deleted");
    assert.equal(updateArg.isOnline, false);
  });

  it("does not soft-delete when password verification fails", async () => {
    const correctHash = await bcrypt.hash("CorrectPassword!", 10);
    const updateFn = mock.fn(async () => {});

    mock.method(User, "findByPk", async () => ({
      id: 1,
      passwordHash: correctHash,
      update: updateFn,
    }));

    const req = {
      user: { id: 1 },
      body: { password: "WrongPassword!" },
    };
    const res = createRes();

    await deleteAccount(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.equal(updateFn.mock.calls.length, 0);
  });
});
