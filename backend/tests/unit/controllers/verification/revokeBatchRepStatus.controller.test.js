import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { revokeBatchRepStatus } from "../../../../src/controllers/verification/revokeBatchRepStatus.controller.js";
import { sequelize } from "../../../../src/modules/index.js";
import VerificationRequest from "../../../../src/modules/VerificationRequest.model.js";
import StudentProfile from "../../../../src/modules/StudentProfile.model.js";
import User from "../../../../src/modules/User.model.js";
import bcrypt from "bcryptjs";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeTransaction = () => {
  const t = {
    commit: mock.fn(async () => {}),
    rollback: mock.fn(async () => {}),
  };
  mock.method(sequelize, "transaction", async () => t);
  return t;
};

describe("revokeBatchRepStatus", () => {
  it("returns 400 if no password is provided", async () => {
    const t = makeTransaction();

    const req = { user: { id: 1 }, body: {} };
    const res = createRes();
    const next = mockNext();

    await revokeBatchRepStatus(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Password is required/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 404 if the user is not found", async () => {
    const t = makeTransaction();
    mock.method(User, "findByPk", async () => null);

    const req = { user: { id: 1 }, body: { password: "secret" } };
    const res = createRes();
    const next = mockNext();

    await revokeBatchRepStatus(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.equal(res.getBody().success, false);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 401 if the password is invalid", async () => {
    const t = makeTransaction();
    mock.method(User, "findByPk", async () => ({ id: 1, passwordHash: "hash" }));
    mock.method(bcrypt, "compare", async () => false);

    const req = { user: { id: 1 }, body: { password: "wrong" } };
    const res = createRes();
    const next = mockNext();

    await revokeBatchRepStatus(req, res, next);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /Invalid password/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 404 if there is no approved Batch Rep verification", async () => {
    const t = makeTransaction();
    mock.method(User, "findByPk", async () => ({ id: 1, passwordHash: "hash" }));
    mock.method(bcrypt, "compare", async () => true);
    mock.method(VerificationRequest, "findOne", async () => null);

    const req = { user: { id: 1 }, body: { password: "secret" } };
    const res = createRes();
    const next = mockNext();

    await revokeBatchRepStatus(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /No active Batch Rep verification found/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 200 and revokes the Batch Rep status", async () => {
    const t = makeTransaction();
    mock.method(User, "findByPk", async () => ({ id: 1, passwordHash: "hash" }));
    mock.method(bcrypt, "compare", async () => true);
    const destroy = mock.fn(async () => {});
    mock.method(VerificationRequest, "findOne", async () => ({
      documentUrl: "https://example.com/verifications/doc.pdf",
      destroy,
    }));
    const studentSave = mock.fn(async () => {});
    const studentProfile = { isBatchRep: true, save: studentSave };
    mock.method(StudentProfile, "findOne", async () => studentProfile);

    const req = { user: { id: 1 }, body: { password: "secret" } };
    const res = createRes();
    const next = mockNext();

    await revokeBatchRepStatus(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.match(res.getBody().message, /revoked successfully/i);
    assert.equal(studentProfile.isBatchRep, false);
    assert.equal(studentSave.mock.calls.length, 1);
    assert.equal(destroy.mock.calls.length, 1);
    assert.equal(destroy.mock.calls[0].arguments[0].force, true);
    assert.equal(t.commit.mock.calls.length, 1);
    assert.equal(t.rollback.mock.calls.length, 0);
  });

  it("rolls back and forwards errors to next", async () => {
    const t = makeTransaction();
    mock.method(User, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, body: { password: "secret" } };
    const res = createRes();
    const next = mockNext();

    await revokeBatchRepStatus(req, res, next);

    assert.equal(t.rollback.mock.calls.length, 1);
    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
