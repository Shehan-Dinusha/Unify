import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { getPendingVerifications } from "../../../../src/controllers/verification/getPendingVerifications.controller.js";
import VerificationRequest from "../../../../src/modules/VerificationRequest.model.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeRequest = (overrides = {}) => ({
  id: 1,
  requestedRole: "Club",
  status: "PENDING",
  createdAt: new Date("2026-05-01T10:00:00Z"),
  documentUrl: "https://example.com/verifications/doc.pdf",
  documentMetadata: { originalName: "cert.pdf", mimeType: "application/pdf", size: 2048 },
  user: { id: 7, name: "Alice", avatar: null },
  ...overrides,
});

const mockCounts = (values) => {
  let index = 0;
  mock.method(VerificationRequest, "count", async () => {
    const value = values[index] ?? 0;
    index += 1;
    return value;
  });
  return VerificationRequest.count;
};

describe("getPendingVerifications", () => {
  it("returns 200 with stats and formatted requests when lastViewed is present", async () => {
    const countFn = mockCounts([10, 2, 3, 5]);
    mock.method(VerificationRequest, "findAll", async () => [makeRequest()]);

    const req = { user: { id: 1 }, query: { lastViewed: "1750000000000" } };
    const res = createRes();
    const next = mockNext();

    await getPendingVerifications(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const body = res.getBody();
    assert.equal(body.data.stats.totalPending, 10);
    assert.equal(body.data.stats.approvedToday, 2);
    assert.equal(body.data.stats.rejectedToday, 3);
    assert.equal(body.data.stats.newPending, 5);

    const lastCountWhere = countFn.mock.calls[3].arguments[0].where;
    assert.ok(lastCountWhere.createdAt);

    const request = body.data.requests[0];
    assert.equal(request.name, "Alice");
    assert.equal(request.type, "Club");
    assert.equal(request.fileType, "pdf");
    assert.equal(request.fileSize, "2 KB");
    assert.equal(request.file, "cert.pdf");
    assert.equal(request.url, "https://example.com/verifications/doc.pdf");
    assert.equal(request.status, "pending");
  });

  it("counts new pending since the start of day when lastViewed is absent", async () => {
    const countFn = mockCounts([10, 2, 3, 5]);
    mock.method(VerificationRequest, "findAll", async () => []);

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await getPendingVerifications(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const lastCountWhere = countFn.mock.calls[3].arguments[0].where;
    assert.ok(lastCountWhere.createdAt);
    assert.equal(res.getBody().data.stats.newPending, 5);
  });

  it("defaults newPending to zero when the count is falsy", async () => {
    mockCounts([3, 1, 1, 0]);
    mock.method(VerificationRequest, "findAll", async () => []);

    const req = { user: { id: 1 }, query: { lastViewed: "1750000000000" } };
    const res = createRes();
    const next = mockNext();

    await getPendingVerifications(req, res, next);

    assert.equal(res.getBody().data.stats.newPending, 0);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(VerificationRequest, "count", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await getPendingVerifications(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
