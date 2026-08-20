import { describe, it, before, after, mock } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { UserSession } from "../../../src/modules/index.js";
import { hashToken } from "../../../src/controllers/auth/auth.utils.js";

describe("generateTokens & hashToken", () => {
  let generateTokens;
  let originalSecret, originalRefreshSecret;

  const TEST_SECRET = "test_jwt_secret_for_unit_tests";
  const TEST_REFRESH_SECRET = "test_jwt_refresh_secret_for_unit_tests";

  before(async () => {
    originalSecret = process.env.JWT_SECRET;
    originalRefreshSecret = process.env.JWT_REFRESH_SECRET;

    process.env.JWT_SECRET = TEST_SECRET;
    process.env.JWT_REFRESH_SECRET = TEST_REFRESH_SECRET;

    const mod = await import("../../../src/controllers/auth/auth.utils.js");
    generateTokens = mod.generateTokens;
  });

  after(() => {
    mock.restoreAll();
    if (originalSecret !== undefined) process.env.JWT_SECRET = originalSecret;
    else delete process.env.JWT_SECRET;

    if (originalRefreshSecret !== undefined) process.env.JWT_REFRESH_SECRET = originalRefreshSecret;
    else delete process.env.JWT_REFRESH_SECRET;
  });

  const createMockUser = (overrides = {}) => ({
    id: 1,
    role: "Student",
    ...overrides,
  });

  it("hashToken produces consistent SHA-256 hash", () => {
    const hash1 = hashToken("test-token");
    const hash2 = hashToken("test-token");
    assert.equal(hash1, hash2);
    assert.equal(hash1.length, 64); // SHA-256 hex length
  });

  it("returns an object with accessToken and refreshToken", async () => {
    mock.method(UserSession, "create", async () => ({}));
    const user = createMockUser();
    const result = await generateTokens(user);

    assert.ok(result.accessToken);
    assert.ok(result.refreshToken);
    assert.equal(typeof result.accessToken, "string");
    assert.equal(typeof result.refreshToken, "string");
  });

  it("access token contains user id and role", async () => {
    mock.method(UserSession, "create", async () => ({}));
    const user = createMockUser({ id: 42, role: "Club" });
    const { accessToken } = await generateTokens(user);

    const decoded = jwt.verify(accessToken, TEST_SECRET);
    assert.equal(decoded.id, 42);
    assert.equal(decoded.role, "Club");
  });

  it("refresh token contains user id", async () => {
    mock.method(UserSession, "create", async () => ({}));
    const user = createMockUser({ id: 7 });
    const { refreshToken } = await generateTokens(user);

    const decoded = jwt.verify(refreshToken, TEST_REFRESH_SECRET);
    assert.equal(decoded.id, 7);
  });

  it("creates a UserSession row with hashed refresh token", async () => {
    let createdPayload = null;
    mock.method(UserSession, "create", async (payload) => {
      createdPayload = payload;
      return payload;
    });

    const user = createMockUser({ id: 99 });
    const req = { headers: { "user-agent": "TestBrowser/1.0" }, ip: "127.0.0.1" };
    const { refreshToken } = await generateTokens(user, req);

    assert.ok(createdPayload);
    assert.equal(createdPayload.userId, 99);
    assert.equal(createdPayload.tokenHash, hashToken(refreshToken));
    assert.equal(createdPayload.userAgent, "TestBrowser/1.0");
    assert.equal(createdPayload.ipAddress, "127.0.0.1");
    assert.ok(createdPayload.expiresAt instanceof Date);
  });
});
