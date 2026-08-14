import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

describe("generateTokens", () => {
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
    if (originalSecret !== undefined) process.env.JWT_SECRET = originalSecret;
    else delete process.env.JWT_SECRET;

    if (originalRefreshSecret !== undefined) process.env.JWT_REFRESH_SECRET = originalRefreshSecret;
    else delete process.env.JWT_REFRESH_SECRET;
  });

  const createMockUser = (overrides = {}) => ({
    id: 1,
    role: "Student",
    refreshToken: null,
    save: async function () {},
    ...overrides,
  });

  it("returns an object with accessToken and refreshToken", async () => {
    const user = createMockUser();
    const result = await generateTokens(user);

    assert.ok(result.accessToken);
    assert.ok(result.refreshToken);
    assert.equal(typeof result.accessToken, "string");
    assert.equal(typeof result.refreshToken, "string");
  });

  it("access token contains user id and role", async () => {
    const user = createMockUser({ id: 42, role: "Club" });
    const { accessToken } = await generateTokens(user);

    const decoded = jwt.verify(accessToken, TEST_SECRET);
    assert.equal(decoded.id, 42);
    assert.equal(decoded.role, "Club");
  });

  it("refresh token contains user id", async () => {
    const user = createMockUser({ id: 7 });
    const { refreshToken } = await generateTokens(user);

    const decoded = jwt.verify(refreshToken, TEST_REFRESH_SECRET);
    assert.equal(decoded.id, 7);
  });

  it("saves the refresh token to the user object", async () => {
    const user = createMockUser();
    const { refreshToken } = await generateTokens(user);

    assert.equal(user.refreshToken, refreshToken);
  });

  it("calls user.save() to persist the refresh token", async () => {
    let saveCalled = false;
    const user = createMockUser({
      save: async function () {
        saveCalled = true;
      },
    });

    await generateTokens(user);
    assert.equal(saveCalled, true);
  });
});
