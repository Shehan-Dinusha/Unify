import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { getVerificationStatus } from "../../../../src/controllers/verification/getVerificationStatus.controller.js";
import VerificationRequest from "../../../../src/modules/VerificationRequest.model.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeRequest = (overrides = {}) => ({
  status: "PENDING",
  requestedRole: "Club",
  adminMessage: null,
  documentUrl: "https://example.com/verifications/doc.pdf",
  documentMetadata: { originalName: "cert.pdf", size: 2048 },
  ...overrides,
});

describe("getVerificationStatus", () => {
  it("returns idle when there are no requests", async () => {
    mock.method(VerificationRequest, "findOne", async (opts) => {
      if (opts && opts.paranoid !== undefined) return null;
      return null;
    });

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await getVerificationStatus(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().data.hasRequest, false);
    assert.equal(res.getBody().data.status, "idle");
  });

  it("returns removed status for a soft-deleted request", async () => {
    mock.method(VerificationRequest, "findOne", async (opts) => {
      if (opts && opts.paranoid !== undefined) return makeRequest({ deletedAt: new Date(), adminMessage: "Removed" });
      return null;
    });

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await getVerificationStatus(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().data.hasRequest, true);
    assert.equal(res.getBody().data.status, "removed");
    assert.equal(res.getBody().data.declineReason, "Removed");
    assert.equal(res.getBody().data.document.url, "https://example.com/verifications/doc.pdf");
  });

  it("returns the active request status", async () => {
    mock.method(VerificationRequest, "findOne", async () =>
      makeRequest({ status: "PENDING", requestedRole: "Batch Rep" }),
    );

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await getVerificationStatus(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().data.hasRequest, true);
    assert.equal(res.getBody().data.status, "pending");
    assert.equal(res.getBody().data.requestedRole, "Batch Rep");
    assert.equal(res.getBody().data.document.name, "cert.pdf");
    assert.equal(res.getBody().data.document.size, 2048);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(VerificationRequest, "findOne", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await getVerificationStatus(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
