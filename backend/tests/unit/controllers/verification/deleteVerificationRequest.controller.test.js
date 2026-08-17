import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes, mockNext } from "../../../helpers/testUtils.js";
import { deleteVerificationRequest } from "../../../../src/controllers/verification/deleteVerificationRequest.controller.js";
import VerificationRequest from "../../../../src/modules/VerificationRequest.model.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("deleteVerificationRequest", () => {
  it("returns 404 if there is no active submission", async () => {
    mock.method(VerificationRequest, "findOne", async () => null);

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await deleteVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().message, /No active verification submission found/i);
  });

  it("returns 200 and hard-deletes the request", async () => {
    const save = mock.fn(async () => {});
    const destroy = mock.fn(async () => {});
    const request = {
      documentUrl: "https://example.com/verifications/doc.pdf",
      save,
      destroy,
    };
    mock.method(VerificationRequest, "findOne", async () => request);

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await deleteVerificationRequest(req, res, next);

    assert.equal(res.getStatusCode(), 200);
    assert.match(res.getBody().message, /deleted successfully/i);
    assert.equal(request.documentUrl, null);
    assert.equal(save.mock.calls.length, 1);
    assert.equal(destroy.mock.calls.length, 1);
    assert.equal(destroy.mock.calls[0].arguments[0].force, true);
    assert.equal(next.called, false);
  });

  it("forwards unexpected errors to next", async () => {
    mock.method(VerificationRequest, "findOne", async () => {
      throw new Error("boom");
    });

    const req = { user: { id: 1 } };
    const res = createRes();
    const next = mockNext();

    await deleteVerificationRequest(req, res, next);

    assert.equal(next.called, true);
    assert.equal(next.error.message, "boom");
  });
});
