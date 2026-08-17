import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { uploadChatAttachments } from "../../../src/controllers/chat/uploadChatAttachments.controller.js";

/**
 * Helper to create a mock Express response.
 */
const createRes = () => {
  let statusCode;
  let body;
  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      body = data;
      return res;
    },
    getStatusCode: () => statusCode,
    getBody: () => body,
  };
  return res;
};

describe("uploadChatAttachments", () => {
  it("returns 400 when req.files is undefined", async () => {
    const req = {};
    const res = createRes();

    await uploadChatAttachments(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /no files/i);
  });

  it("returns 400 when req.files is an empty array", async () => {
    const req = { files: [] };
    const res = createRes();

    await uploadChatAttachments(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.equal(res.getBody().success, false);
  });

  it("returns 200 with correct attachment metadata for a single file", async () => {
    const req = {
      files: [
        {
          location: "chat-attachments/file1.png",
          originalname: "screenshot.png",
          mimetype: "image/png",
          size: 102400,
        },
      ],
    };
    const res = createRes();

    await uploadChatAttachments(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);

    const attachments = res.getBody().data;
    assert.equal(attachments.length, 1);
    assert.equal(attachments[0].key, "chat-attachments/file1.png");
    assert.equal(attachments[0].name, "screenshot.png");
    assert.equal(attachments[0].type, "image/png");
    assert.equal(attachments[0].size, 102400);
    assert.equal(attachments[0].isImage, true);
  });

  it("correctly identifies non-image files", async () => {
    const req = {
      files: [
        {
          location: "chat-attachments/doc.pdf",
          originalname: "document.pdf",
          mimetype: "application/pdf",
          size: 204800,
        },
      ],
    };
    const res = createRes();

    await uploadChatAttachments(req, res);

    assert.equal(res.getStatusCode(), 200);
    const attachments = res.getBody().data;
    assert.equal(attachments[0].isImage, false);
  });

  it("handles multiple file uploads", async () => {
    const req = {
      files: [
        {
          location: "chat-attachments/img1.jpg",
          originalname: "photo.jpg",
          mimetype: "image/jpeg",
          size: 50000,
        },
        {
          location: "chat-attachments/doc.pdf",
          originalname: "report.pdf",
          mimetype: "application/pdf",
          size: 120000,
        },
        {
          location: "chat-attachments/img2.gif",
          originalname: "animation.gif",
          mimetype: "image/gif",
          size: 300000,
        },
      ],
    };
    const res = createRes();

    await uploadChatAttachments(req, res);

    assert.equal(res.getStatusCode(), 200);
    const attachments = res.getBody().data;
    assert.equal(attachments.length, 3);
    assert.equal(attachments[0].isImage, true);
    assert.equal(attachments[1].isImage, false);
    assert.equal(attachments[2].isImage, true);
  });
});
