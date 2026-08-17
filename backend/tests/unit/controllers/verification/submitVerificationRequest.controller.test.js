import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { submitVerificationRequest } from "../../../../src/controllers/verification/submitVerificationRequest.controller.js";
import VerificationRequest from "../../../../src/modules/VerificationRequest.model.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeFile = (overrides = {}) => ({
  s3Key: "https://example.com/verifications/doc.pdf",
  originalname: "cert.pdf",
  mimetype: "application/pdf",
  size: 2048,
  ...overrides,
});

describe("submitVerificationRequest", () => {
  it("returns 403 if a non-Club requests Club verification", async () => {
    const req = {
      user: { id: 1, role: "Student" },
      body: { requestedRole: "Club" },
      file: makeFile(),
    };
    const res = createRes();
    const next = mockNext();

    await submitVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /Only Club accounts can submit club verification requests/i);
  });

  it("returns 403 if a non-Student requests Batch Rep verification", async () => {
    const req = {
      user: { id: 1, role: "Club" },
      body: { requestedRole: "Batch Rep" },
      file: makeFile(),
    };
    const res = createRes();
    const next = mockNext();

    await submitVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /Only Students can submit batch rep verification requests/i);
  });

  it("returns 400 if no document file is uploaded", async () => {
    const req = { user: { id: 1, role: "Student" }, body: {}, file: undefined };
    const res = createRes();
    const next = mockNext();

    await submitVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Verification document is required/i);
  });

  it("returns 400 if there is an active verification submission", async () => {
    mock.method(VerificationRequest, "findOne", async () => ({ status: "PENDING" }));

    const req = { user: { id: 1, role: "Student" }, body: {}, file: makeFile() };
    const res = createRes();
    const next = mockNext();

    await submitVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /already have an active verification submission/i);
  });

  it("returns 201 and creates a pending request with defaults", async () => {
    mock.method(VerificationRequest, "findOne", async () => null);
    const newRequest = {
      id: 10,
      userId: 1,
      requestedRole: "Batch Rep",
      documentUrl: "https://example.com/verifications/doc.pdf",
      documentMetadata: { originalName: "cert.pdf", mimeType: "application/pdf", size: 2048 },
      status: "PENDING",
      toJSON() {
        return { ...this };
      },
    };
    const createFn = mock.fn(async () => newRequest);
    mock.method(VerificationRequest, "create", createFn);

    const req = { user: { id: 1, role: "Student" }, body: {}, file: makeFile() };
    const res = createRes();
    const next = mockNext();

    await submitVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 201);
    const args = createFn.mock.calls[0].arguments[0];
    assert.equal(args.userId, 1);
    assert.equal(args.requestedRole, "Batch Rep");
    assert.equal(args.status, "PENDING");
    assert.equal(args.documentUrl, "https://example.com/verifications/doc.pdf");
    assert.equal(args.documentMetadata.originalName, "cert.pdf");
    assert.equal(res.getBody().data.documentUrl, "https://example.com/verifications/doc.pdf");
    assert.equal(next.called, false);
  });

  it("replaces a previously declined request", async () => {
    const destroy = mock.fn(async () => {});
    mock.method(VerificationRequest, "findOne", async () => ({
      status: "DECLINED",
      documentUrl: "https://old.example.com/doc.pdf",
      destroy,
    }));
    const createFn = mock.fn(async (data) => ({ id: 11, ...data, toJSON: () => ({ id: 11 }) }));
    mock.method(VerificationRequest, "create", createFn);

    const req = {
      user: { id: 1, role: "Student" },
      body: { requestedRole: "Batch Rep" },
      file: makeFile(),
    };
    const res = createRes();
    const next = mockNext();

    await submitVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(destroy.mock.calls.length, 1);
    assert.equal(destroy.mock.calls[0].arguments[0].force, true);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(VerificationRequest, "findOne", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1, role: "Student" }, body: {}, file: makeFile() };
    const res = createRes();
    const next = mockNext();

    await submitVerificationRequest(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
