import { describe, it, afterEach, mock, before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { User, StudentProfile } from "../../../src/modules/index.js";

// Import the middleware
import { protect, authorize, isBatchRep } from "../../../src/middlewares/auth.middleware.js";

const TEST_SECRET = "test_auth_middleware_secret";
let originalSecret;

before(() => {
  originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = TEST_SECRET;
});

after(() => {
  if (originalSecret !== undefined) process.env.JWT_SECRET = originalSecret;
  else delete process.env.JWT_SECRET;
});

afterEach(() => {
  mock.restoreAll();
});

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

describe("protect middleware", () => {
  it("returns 401 when no Authorization header is present", async () => {
    const req = { headers: {} };
    const res = createRes();
    let nextCalled = false;

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 401);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /no token/i);
    assert.equal(nextCalled, false);
  });

  it("returns 401 when Authorization header does not start with Bearer", async () => {
    const req = { headers: { authorization: "Basic sometoken" } };
    const res = createRes();
    let nextCalled = false;

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 401);
    assert.equal(nextCalled, false);
  });

  it("returns 401 when token is invalid", async () => {
    const req = { headers: { authorization: "Bearer invalidtoken123" } };
    const res = createRes();
    let nextCalled = false;

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /token failed/i);
    assert.equal(nextCalled, false);
  });

  it("returns 401 when user is not found in the database", async () => {
    const token = jwt.sign({ id: 999 }, TEST_SECRET, { expiresIn: "15m" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    let nextCalled = false;

    mock.method(User, "findByPk", async () => null);

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /not found/i);
    assert.equal(nextCalled, false);
  });

  it("returns 403 when user status is Suspended", async () => {
    const token = jwt.sign({ id: 1 }, TEST_SECRET, { expiresIn: "15m" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    let nextCalled = false;

    mock.method(User, "findByPk", async () => ({
      id: 1,
      role: "Student",
      status: "Suspended",
    }));

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /suspended/i);
    assert.equal(nextCalled, false);
  });

  it("returns 401 when user status is Deleted", async () => {
    const token = jwt.sign({ id: 1 }, TEST_SECRET, { expiresIn: "15m" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    let nextCalled = false;

    mock.method(User, "findByPk", async () => ({
      id: 1,
      role: "Student",
      status: "Deleted",
    }));

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 401);
    assert.match(res.getBody().message, /deleted/i);
    assert.equal(nextCalled, false);
  });

  it("attaches user to req and calls next() on valid token and active user", async () => {
    const token = jwt.sign({ id: 5, role: "Student" }, TEST_SECRET, { expiresIn: "15m" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    let nextCalled = false;

    const mockUser = { id: 5, role: "Student", status: "Active", name: "Test User" };
    mock.method(User, "findByPk", async () => mockUser);

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.equal(req.user.id, 5);
    assert.equal(req.user.role, "Student");
  });

  it("returns 401 when token is expired", async () => {
    const token = jwt.sign({ id: 1 }, TEST_SECRET, { expiresIn: "0s" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    let nextCalled = false;

    // Small delay to ensure token is expired
    await new Promise((resolve) => setTimeout(resolve, 10));

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 401);
    assert.equal(nextCalled, false);
  });

  it("returns 503 when database throws a Sequelize connection error (e.g. SequelizeHostNotFoundError / ENOTFOUND)", async () => {
    const token = jwt.sign({ id: 1 }, TEST_SECRET, { expiresIn: "15m" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    let nextCalled = false;

    const dbError = new Error("getaddrinfo ENOTFOUND database-1.cj6ue8k8cg0v.eu-north-1.rds.amazonaws.com");
    dbError.name = "SequelizeHostNotFoundError";
    dbError.code = "ENOTFOUND";

    mock.method(User, "findByPk", async () => {
      throw dbError;
    });

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 503);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /service temporarily unavailable/i);
    assert.equal(nextCalled, false);
  });

  it("returns 503 when database throws ECONNREFUSED network error", async () => {
    const token = jwt.sign({ id: 1 }, TEST_SECRET, { expiresIn: "15m" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    let nextCalled = false;

    const netError = new Error("connect ECONNREFUSED 127.0.0.1:5432");
    netError.code = "ECONNREFUSED";

    mock.method(User, "findByPk", async () => {
      throw netError;
    });

    await protect(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 503);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /service temporarily unavailable/i);
    assert.equal(nextCalled, false);
  });
});

describe("authorize middleware", () => {
  it("calls next() when user role is in the allowed list", () => {
    const middleware = authorize("Student", "Club");
    const req = { user: { role: "Student" } };
    const res = createRes();
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
  });

  it("returns 403 when user role is not in the allowed list", () => {
    const middleware = authorize("Admin");
    const req = { user: { role: "Student" } };
    const res = createRes();
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 403);
    assert.equal(nextCalled, false);
    assert.match(res.getBody().message, /not authorized/i);
  });

  it("returns 403 when req.user is undefined", () => {
    const middleware = authorize("Student");
    const req = {};
    const res = createRes();
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 403);
    assert.equal(nextCalled, false);
  });

  it("supports multiple allowed roles", () => {
    const middleware = authorize("Student", "Club", "Admin");
    const req = { user: { role: "Club" } };
    const res = createRes();
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
  });
});

describe("isBatchRep middleware", () => {
  it("calls next() when user is a batch rep", async () => {
    const req = { user: { id: 1 } };
    const res = createRes();
    let nextCalled = false;

    mock.method(StudentProfile, "findOne", async () => ({ isBatchRep: true }));

    await isBatchRep(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
  });

  it("returns 403 when user is not a batch rep", async () => {
    const req = { user: { id: 1 } };
    const res = createRes();
    let nextCalled = false;

    mock.method(StudentProfile, "findOne", async () => ({ isBatchRep: false }));

    await isBatchRep(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().message, /batch rep/i);
    assert.equal(nextCalled, false);
  });

  it("returns 403 when no student profile exists", async () => {
    const req = { user: { id: 999 } };
    const res = createRes();
    let nextCalled = false;

    mock.method(StudentProfile, "findOne", async () => null);

    await isBatchRep(req, res, () => { nextCalled = true; });

    assert.equal(res.getStatusCode(), 403);
    assert.equal(nextCalled, false);
  });
});
