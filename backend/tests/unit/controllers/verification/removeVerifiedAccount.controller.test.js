import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { removeVerifiedAccount } from "../../../../src/controllers/verification/removeVerifiedAccount.controller.js";
import { sequelize } from "../../../../src/modules/index.js";
import VerificationRequest from "../../../../src/modules/VerificationRequest.model.js";
import User from "../../../../src/modules/User.model.js";
import ClubProfile from "../../../../src/modules/ClubProfile.model.js";
import StudentProfile from "../../../../src/modules/StudentProfile.model.js";
import AdminLog from "../../../../src/modules/AdminLog.model.js";

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

const makeRequest = (overrides = {}) => {
  const save = mock.fn(async () => {});
  const destroy = mock.fn(async () => {});
  return {
    id: 5,
    status: "APPROVED",
    requestedRole: "Club",
    user: { id: 7, role: "Club", name: "User" },
    save,
    destroy,
    ...overrides,
  };
};

describe("removeVerifiedAccount", () => {
  it("returns 404 if the request is not found", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () => null);

    const req = { user: { id: 99 }, params: { id: "5" }, body: { reason: "Abuse" } };
    const res = createRes();
    const next = mockNext();

    await removeVerifiedAccount(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Verification request not found/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 400 if the request is not approved", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () =>
      makeRequest({ status: "PENDING" }),
    );

    const req = { user: { id: 99 }, params: { id: "5" }, body: { reason: "Abuse" } };
    const res = createRes();
    const next = mockNext();

    await removeVerifiedAccount(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Only approved accounts can be removed/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 200 and reverts a verified club", async () => {
    const t = makeTransaction();
    const request = makeRequest();
    const clubSave = mock.fn(async () => {});
    const clubProfile = { isVerified: true, save: clubSave };
    mock.method(VerificationRequest, "findByPk", async () => request);
    mock.method(ClubProfile, "findOne", async () => clubProfile);
    const adminCreate = mock.fn(async () => {});
    mock.method(AdminLog, "create", adminCreate);

    const req = { user: { id: 99 }, params: { id: "5" }, body: { reason: "  Policy violation  " } };
    const res = createRes();
    const next = mockNext();

    await removeVerifiedAccount(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.match(res.getBody().message, /revoked and removed/i);
    assert.equal(clubProfile.isVerified, false);
    assert.equal(clubSave.mock.calls.length, 1);
    assert.equal(request.status, "DECLINED");
    assert.equal(request.adminMessage, "Policy violation");
    assert.equal(request.destroy.mock.calls.length, 1);
    assert.equal(t.commit.mock.calls.length, 1);
    assert.equal(t.rollback.mock.calls.length, 0);
    const adminArgs = adminCreate.mock.calls[0].arguments[0];
    assert.equal(adminArgs.type, "verification_removed");
  });

  it("returns 200 and reverts a Batch Rep", async () => {
    const t = makeTransaction();
    const request = makeRequest({
      requestedRole: "Batch Rep",
      user: { id: 7, role: "Student", name: "User" },
    });
    const studentSave = mock.fn(async () => {});
    const studentProfile = { isBatchRep: true, save: studentSave };
    mock.method(VerificationRequest, "findByPk", async () => request);
    mock.method(StudentProfile, "findOne", async () => studentProfile);
    mock.method(AdminLog, "create", async () => {});

    const req = { user: { id: 99 }, params: { id: "5" }, body: { reason: "Fraud" } };
    const res = createRes();
    const next = mockNext();

    await removeVerifiedAccount(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(studentProfile.isBatchRep, false);
    assert.equal(studentSave.mock.calls.length, 1);
    assert.equal(t.commit.mock.calls.length, 1);
  });

  it("returns 200 and defaults an unknown role back to Student", async () => {
    const t = makeTransaction();
    const userSave = mock.fn(async () => {});
    const request = makeRequest({
      requestedRole: "Business",
      user: { id: 7, role: "Business", name: "User", save: userSave },
    });
    mock.method(VerificationRequest, "findByPk", async () => request);
    mock.method(AdminLog, "create", async () => {});

    const req = { user: { id: 99 }, params: { id: "5" }, body: { reason: "x" } };
    const res = createRes();
    const next = mockNext();

    await removeVerifiedAccount(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(request.user.role, "Student");
    assert.equal(userSave.mock.calls.length, 1);
    assert.equal(t.commit.mock.calls.length, 1);
  });

  it("rolls back and forwards errors to next", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 99 }, params: { id: "5" }, body: { reason: "x" } };
    const res = createRes();
    const next = mockNext();

    await removeVerifiedAccount(req, res, next);

    assert.equal(t.rollback.mock.calls.length, 1);
    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
