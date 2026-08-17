import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizePhone } from "../../../src/utils/phone.util.js";

describe("normalizePhone", () => {
  it("returns null for null input", () => {
    assert.equal(normalizePhone(null), null);
  });

  it("returns undefined for undefined input", () => {
    assert.equal(normalizePhone(undefined), undefined);
  });

  it("returns non-string input as-is", () => {
    assert.equal(normalizePhone(12345), 12345);
  });

  it("returns empty string unchanged", () => {
    assert.equal(normalizePhone(""), "");
  });

  it("converts local 0-prefix number to +94", () => {
    assert.equal(normalizePhone("0771234567"), "+94771234567");
  });

  it("strips spaces before normalizing", () => {
    assert.equal(normalizePhone("077 123 4567"), "+94771234567");
  });

  it("strips dashes before normalizing", () => {
    assert.equal(normalizePhone("077-123-4567"), "+94771234567");
  });

  it("strips parentheses before normalizing", () => {
    assert.equal(normalizePhone("(077)1234567"), "+94771234567");
  });

  it("converts 94-prefix without + to +94", () => {
    assert.equal(normalizePhone("94771234567"), "+94771234567");
  });

  it("keeps already-normalized +94 number unchanged", () => {
    assert.equal(normalizePhone("+94771234567"), "+94771234567");
  });

  it("converts 0094 international prefix to +94", () => {
    assert.equal(normalizePhone("0094771234567"), "+94771234567");
  });

  it("converts raw 9-digit number to +94", () => {
    assert.equal(normalizePhone("771234567"), "+94771234567");
  });

  it("handles mixed spaces and dashes", () => {
    assert.equal(normalizePhone("077-123 4567"), "+94771234567");
  });
});
