import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { rejectVerificationRequest } from "../../../../src/controllers/verification/rejectVerificationRequest.controller.js";
import { sequelize } from "../../../../src/modules/index.js";
import VerificationRequest from "../../../../src/modules/VerificationRequest.model.js";
import User from "../../../../src/modules/User.model.js";
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

describe("rejectVerificationRequest", () => {
  it("returns 400 if the request is not pending", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () => ({ status: "APPROVED" }));

    const req = { user: { id: 99 }, params: { id: "5" }, body: { reason: "Bad doc" } };
    const res = createRes();
    const next = mockNext();

    await rejectVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Valid pending verification request not found/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 200 and marks the request declined with a trimmed reason", async () => {
    const t = makeTransaction();
    const save = mock.fn(async () => {});
    const request = {
      id: 5,
      status: "PENDING",
      requestedRole: "Club",
      user: { id: 7, name: "User" },
      save,
    };
    mock.method(VerificationRequest, "findByPk", async () => request);
    const adminCreate = mock.fn(async () => {});
    mock.method(AdminLog, "create", adminCreate);

    const req = { user: { id: 99 }, params: { id: "5" }, body: { reason: "  Incomplete document  " } };
    const res = createRes();
    const next = mockNext();

    await rejectVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.match(res.getBody().message, /successfully rejected/i);
    assert.equal(request.status, "DECLINED");
    assert.equal(request.adminMessage, "Incomplete document");
    assert.equal(save.mock.calls.length, 1);
    assert.equal(t.commit.mock.calls.length, 1);
    assert.equal(t.rollback.mock.calls.length, 0);
    const adminArgs = adminCreate.mock.calls[0].arguments[0];
    assert.equal(adminArgs.type, "verification_rejected");
  });

  it("rolls back and forwards errors to next", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 99 }, params: { id: "5" }, body: { reason: "x" } };
    const res = createRes();
    const next = mockNext();

    await rejectVerificationRequest(req, res, next);

    assert.equal(t.rollback.mock.calls.length, 1);
    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
