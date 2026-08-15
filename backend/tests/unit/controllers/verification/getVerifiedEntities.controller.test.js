import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { getVerifiedEntities } from "../../../../src/controllers/verification/getVerifiedEntities.controller.js";
import VerificationRequest from "../../../../src/modules/VerificationRequest.model.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeRequest = (overrides = {}) => ({
  id: 1,
  requestedRole: "Club",
  updatedAt: new Date("2026-05-01T10:00:00Z"),
  documentUrl: "https://example.com/verifications/doc.pdf",
  documentMetadata: { originalName: "cert.pdf" },
  user: {
    id: 7,
    name: "Alice",
    email: "alice@uni.edu",
    avatar: null,
    studentProfile: {
      degree: { name: "Computer Science" },
      batch: { name: "2026" },
    },
  },
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

describe("getVerifiedEntities", () => {
  it("returns 200 with stats and formatted entities when lastViewed is present", async () => {
    const countFn = mockCounts([1, 2, 3, 4, 9]);
    mock.method(VerificationRequest, "findAll", async () => [makeRequest()]);

    const req = { user: { id: 1 }, query: { lastViewed: "1750000000000" } };
    const res = createRes();
    const next = mockNext();

    await getVerifiedEntities(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const body = res.getBody();
    assert.equal(body.data.stats.newVerifiedClubs, 1);
    assert.equal(body.data.stats.newVerifiedReps, 2);
    assert.equal(body.data.stats.totalClubs, 3);
    assert.equal(body.data.stats.totalBatchReps, 4);
    assert.equal(body.data.stats.totalVerified, 9);

    const firstCountWhere = countFn.mock.calls[0].arguments[0].where;
    assert.equal(firstCountWhere.requestedRole, "Club");
    assert.ok(firstCountWhere.updatedAt);

    const entity = body.data.verified[0];
    assert.equal(entity.name, "Alice");
    assert.equal(entity.email, "alice@uni.edu");
    assert.equal(entity.type, "Club");
    assert.equal(entity.degree, "Computer Science");
    assert.equal(entity.batch, "2026");
    assert.equal(entity.documentUrl, "https://example.com/verifications/doc.pdf");
  });

  it("counts since the start of day when lastViewed is absent", async () => {
    const countFn = mockCounts([1, 2, 3, 4, 9]);
    mock.method(VerificationRequest, "findAll", async () => []);

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await getVerifiedEntities(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    const firstCountWhere = countFn.mock.calls[0].arguments[0].where;
    assert.ok(firstCountWhere.updatedAt);
    assert.equal(res.getBody().data.stats.totalVerified, 9);
  });

  it("falls back when user data is missing", async () => {
    mockCounts([0, 0, 0, 0, 0]);
    mock.method(VerificationRequest, "findAll", async () => [
      makeRequest({ user: null, documentMetadata: null }),
    ]);

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await getVerifiedEntities(req, res, next);

    const entity = res.getBody().data.verified[0];
    assert.equal(entity.name, "Unknown User");
    assert.equal(entity.email, "No email available");
    assert.equal(entity.documentName, "Document");
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(VerificationRequest, "count", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = mockNext();

    await getVerifiedEntities(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
