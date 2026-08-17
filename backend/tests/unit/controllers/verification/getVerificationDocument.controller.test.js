import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { getVerificationDocument } from "../../../../src/controllers/verification/getVerificationDocument.controller.js";
import VerificationRequest from "../../../../src/modules/VerificationRequest.model.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("getVerificationDocument", () => {
  it("returns 404 if the request is not found", async () => {
    mock.method(VerificationRequest, "findByPk", async () => null);

    const req = { user: { id: 1 }, params: { id: "999" } };
    const res = createRes();
    const next = mockNext();

    await getVerificationDocument(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /Verification request not found/i);
  });

  it("returns 404 if the request has no document", async () => {
    mock.method(VerificationRequest, "findByPk", async () => ({ documentUrl: null }));

    const req = { user: { id: 1 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await getVerificationDocument(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /No document associated/i);
  });

  it("returns 200 with the resolved document URL and metadata", async () => {
    const documentMetadata = { originalName: "cert.pdf", mimeType: "application/pdf", size: 2048 };
    mock.method(VerificationRequest, "findByPk", async () => ({
      documentUrl: "https://example.com/verifications/doc.pdf",
      documentMetadata,
    }));

    const req = { user: { id: 1 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await getVerificationDocument(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().data.documentUrl, "https://example.com/verifications/doc.pdf");
    assert.deepEqual(res.getBody().data.documentMetadata, documentMetadata);
    assert.equal(next.called, false);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(VerificationRequest, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 }, params: { id: "5" } };
    const res = createRes();
    const next = mockNext();

    await getVerificationDocument(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
