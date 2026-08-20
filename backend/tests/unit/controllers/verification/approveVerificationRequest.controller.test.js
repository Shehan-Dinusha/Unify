import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { approveVerificationRequest } from "../../../../src/controllers/verification/approveVerificationRequest.controller.js";
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
  return {
    id: 5,
    status: "PENDING",
    requestedRole: "Club",
    name: "User",
    user: { id: 7, role: "Club", name: "User" },
    save,
    ...overrides,
  };
};

describe("approveVerificationRequest", () => {
  it("returns 400 if the request is not pending", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () =>
      makeRequest({ status: "APPROVED" }),
    );

    const req = { user: { id: 99 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await approveVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Valid pending verification request not found/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 400 if the user role does not match the requested Club role", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () =>
      makeRequest({ user: { id: 7, role: "Student", name: "User" } }),
    );

    const req = { user: { id: 99 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await approveVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /System inconsistency/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 404 if the Club profile is missing", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () => makeRequest());
    mock.method(ClubProfile, "findOne", async () => null);

    const req = { user: { id: 99 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await approveVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Club Profile is missing/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 200 and verifies the club", async () => {
    const t = makeTransaction();
    const request = makeRequest();
    const clubSave = mock.fn(async () => {});
    const clubProfile = { isVerified: false, save: clubSave };
    mock.method(VerificationRequest, "findByPk", async () => request);
    mock.method(ClubProfile, "findOne", async () => clubProfile);
    const adminCreate = mock.fn(async () => {});
    mock.method(AdminLog, "create", adminCreate);

    const req = { user: { id: 99 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await approveVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.match(res.getBody().message, /successfully approved/i);
    assert.equal(request.status, "APPROVED");
    assert.equal(request.save.mock.calls.length, 1);
    assert.equal(t.commit.mock.calls.length, 1);
    assert.equal(t.rollback.mock.calls.length, 0);
    assert.equal(clubProfile.isVerified, true);
    assert.equal(clubSave.mock.calls.length, 1);
    const adminArgs = adminCreate.mock.calls[0].arguments[0];
    assert.equal(adminArgs.type, "verification_approved");
  });

  it("returns 400 if the user role does not match the requested Batch Rep role", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () =>
      makeRequest({ requestedRole: "Batch Rep", user: { id: 7, role: "Club", name: "User" } }),
    );

    const req = { user: { id: 99 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await approveVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Only active Students can be verified as Batch Representatives/i);
    assert.equal(t.rollback.mock.calls.length, 1);
  });

  it("returns 200 and elevates the student to Batch Rep", async () => {
    const t = makeTransaction();
    const studentSave = mock.fn(async () => {});
    mock.method(VerificationRequest, "findByPk", async () =>
      makeRequest({ requestedRole: "Batch Rep", user: { id: 7, role: "Student", name: "User" } }),
    );
    mock.method(StudentProfile, "findOne", async () => ({ isBatchRep: false, save: studentSave }));
    mock.method(AdminLog, "create", async () => {});

    const req = { user: { id: 99 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await approveVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.match(res.getBody().message, /Batch Rep privileges granted/i);
    assert.equal(t.commit.mock.calls.length, 1);
  });

  it("returns 200 and updates the role for a generic requested role", async () => {
    const t = makeTransaction();
    const userSave = mock.fn(async () => {});
    const request = makeRequest({
      requestedRole: "Business",
      user: { id: 7, role: "Student", name: "User", save: userSave },
    });
    mock.method(VerificationRequest, "findByPk", async () => request);
    mock.method(AdminLog, "create", async () => {});

    const req = { user: { id: 99 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await approveVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(request.user.role, "Business");
    assert.equal(userSave.mock.calls.length, 1);
    assert.equal(t.commit.mock.calls.length, 1);
  });

  it("rolls back and forwards errors to next", async () => {
    const t = makeTransaction();
    mock.method(VerificationRequest, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 99 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await approveVerificationRequest(req, res, next);

    assert.equal(t.rollback.mock.calls.length, 1);
    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
