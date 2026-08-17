import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";

// We need to set the env var BEFORE importing the module,
// so we use dynamic import inside the test suite.
describe("encryptText and decryptText", () => {
  let encryptText, decryptText;
  const TEST_KEY = crypto.randomBytes(32).toString("hex"); // Valid 64-char hex key
  let originalKey;

  before(async () => {
    // Save and set env key before importing the module
    originalKey = process.env.CHAT_ENCRYPTION_KEY;
    process.env.CHAT_ENCRYPTION_KEY = TEST_KEY;

    // Dynamic import so the module picks up the env var
    const mod = await import("../../../src/utils/encryption.util.js");
    encryptText = mod.encryptText;
    decryptText = mod.decryptText;
  });

  after(() => {
    // Restore original env
    if (originalKey !== undefined) {
      process.env.CHAT_ENCRYPTION_KEY = originalKey;
    } else {
      delete process.env.CHAT_ENCRYPTION_KEY;
    }
  });

  it("returns null for null input (encrypt)", () => {
    assert.equal(encryptText(null), null);
  });

  it("returns undefined for undefined input (encrypt)", () => {
    assert.equal(encryptText(undefined), undefined);
  });

  it("returns empty string for empty string (encrypt)", () => {
    assert.equal(encryptText(""), "");
  });

  it("returns null for null input (decrypt)", () => {
    assert.equal(decryptText(null), null);
  });

  it("returns undefined for undefined input (decrypt)", () => {
    assert.equal(decryptText(undefined), undefined);
  });

  it("returns empty string for empty string (decrypt)", () => {
    assert.equal(decryptText(""), "");
  });

  it("encrypts and decrypts a message round-trip", () => {
    const plainText = "Hello, this is a secret message!";
    const encrypted = encryptText(plainText);

    assert.notEqual(encrypted, plainText);

    const decrypted = decryptText(encrypted);
    assert.equal(decrypted, plainText);
  });

  it("produces encrypted text in iv:data format", () => {
    const encrypted = encryptText("test message");
    const parts = encrypted.split(":");

    assert.equal(parts.length, 2);
    // IV should be 32 hex characters (16 bytes)
    assert.equal(parts[0].length, 32);
  });

  it("produces different ciphertext for the same plaintext (random IV)", () => {
    const plainText = "same message";
    const encrypted1 = encryptText(plainText);
    const encrypted2 = encryptText(plainText);

    assert.notEqual(encrypted1, encrypted2);
  });

  it("decryptText returns plain text for non-encrypted input", () => {
    const plainText = "this is not encrypted";
    assert.equal(decryptText(plainText), plainText);
  });

  it("decryptText returns raw text when format has wrong IV length", () => {
    const badFormat = "shortiv:someencrypteddata";
    assert.equal(decryptText(badFormat), badFormat);
  });
});
