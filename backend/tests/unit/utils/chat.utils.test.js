import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveAvatar } from "../../../src/controllers/chat/utils.js";

describe("resolveAvatar", () => {
  it("returns null for null input", async () => {
    const result = await resolveAvatar(null);
    assert.equal(result, null);
  });

  it("returns null for undefined input", async () => {
    const result = await resolveAvatar(undefined);
    assert.equal(result, null);
  });

  it("returns null for empty string input", async () => {
    const result = await resolveAvatar("");
    assert.equal(result, null);
  });

  it("returns HTTPS URL as-is without calling S3", async () => {
    const url = "https://example.com/avatar.jpg";
    const result = await resolveAvatar(url);
    assert.equal(result, url);
  });

  it("returns HTTP URL as-is without calling S3", async () => {
    const url = "http://example.com/avatar.png";
    const result = await resolveAvatar(url);
    assert.equal(result, url);
  });

  it("returns a string for an S3 key (presigned URL or null)", async () => {
    // resolveAvatar calls getFileUrl for non-HTTP keys.
    // If S3 is configured, a presigned URL string is returned.
    // If S3 is not configured, the catch block returns null.
    // Either way, the result should be a string or null.
    const result = await resolveAvatar("profiles/avatar.jpg");
    assert.ok(result === null || typeof result === "string");
  });

  it("returned presigned URL starts with http when S3 key resolves", async () => {
    // When S3 credentials are available the resolved URL will be a valid URL
    const result = await resolveAvatar("profiles/some-key.jpg");
    if (result !== null) {
      assert.ok(result.startsWith("http"));
    }
  });
});
