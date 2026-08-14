import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { mockRes } from "../../../helpers/testUtils.js";
import { login } from "../../../../src/controllers/auth/login.controller.js";
import { User, StudentProfile } from "../../../../src/modules/index.js";

process.env.JWT_SECRET = "test_secret";

beforeEach(() => {
  process.env.JWT_SECRET = "test_secret";
});

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeUser = (overrides = {}) => ({
  id: 5,
  email: "alice@example.com",
  phone: "+94771234567",
  name: "Alice",
  role: "Student",
  isVerified: true,
  status: "Active",
  passwordHash: "hashed",
  avatar: null,
  async save() {},
  ...overrides,
});

describe("login", () => {
  it("returns 401 if no user matches the credentials", async () => {
    mock.method(User, "findOne", async () => null);
    mock.method(bcrypt, "compare", async () => true);

    const req = { body: { email: "nobody@example.com", password: "x" } };
    const res = createRes();

    await login(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /Invalid credentials/i);
  });

  it("returns 403 if the account is not verified", async () => {
    mock.method(User, "findOne", async () => makeUser({ isVerified: false }));

    const req = { body: { email: "alice@example.com", password: "x" } };
    const res = createRes();

    await login(req, res);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /verify your account/i);
  });

  it("returns 401 if the account has been deleted", async () => {
    mock.method(User, "findOne", async () => makeUser({ status: "Deleted" }));

    const req = { body: { email: "alice@example.com", password: "x" } };
    const res = createRes();

    await login(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /has been deleted/i);
  });

  it("returns 403 if the account is suspended", async () => {
    mock.method(User, "findOne", async () => makeUser({ status: "Suspended" }));

    const req = { body: { email: "alice@example.com", password: "x" } };
    const res = createRes();

    await login(req, res);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /suspended/i);
  });

  it("returns 401 on wrong password", async () => {
    mock.method(User, "findOne", async () => makeUser());
    mock.method(bcrypt, "compare", async () => false);

    const req = { body: { email: "alice@example.com", password: "wrong" } };
    const res = createRes();

    await login(req, res);

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /Invalid credentials/i);
  });

  it("returns 200 with tokens and role profile data on success", async () => {
    mock.method(User, "findOne", async () => makeUser());
    mock.method(bcrypt, "compare", async () => true);
    mock.method(StudentProfile, "findOne", async () => ({ isBatchRep: true }));

    const req = { body: { email: "alice@example.com", password: "secret123" } };
    const res = createRes();

    await login(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.ok(res.getBody().data.accessToken);
    assert.ok(res.getBody().data.refreshToken);
    assert.equal(res.getBody().data.user.role, "Student");
    assert.equal(res.getBody().data.user.isBatchRep, true);
  });

  it("supports identifier-based login with an email", async () => {
    const findOne = mock.fn(async () => makeUser());
    mock.method(User, "findOne", findOne);
    mock.method(bcrypt, "compare", async () => true);
    mock.method(StudentProfile, "findOne", async () => null);

    const req = { body: { identifier: "alice@example.com", password: "secret123" } };
    const res = createRes();

    await login(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.deepEqual(findOne.mock.calls[0].arguments[0].where, { email: "alice@example.com" });
  });

  it("supports identifier-based login with a phone number", async () => {
    const findOne = mock.fn(async () => makeUser());
    mock.method(User, "findOne", findOne);
    mock.method(bcrypt, "compare", async () => true);
    mock.method(StudentProfile, "findOne", async () => null);

    const req = { body: { identifier: "0771234567", password: "secret123" } };
    const res = createRes();

    await login(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.deepEqual(findOne.mock.calls[0].arguments[0].where, { phone: "+94771234567" });
  });

  it("returns 500 on unexpected error", async () => {
    mock.method(User, "findOne", async () => {
      throw new Error("boom");
    });

    const req = { body: { email: "alice@example.com", password: "x" } };
    const res = createRes();

    await login(req, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().message, "Internal Server Error");
  });
});
