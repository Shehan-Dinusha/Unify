import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import twilio from "twilio";
import { SESClient } from "@aws-sdk/client-ses";
import { mockRes } from "../../../helpers/testUtils.js";
import { register } from "../../../../src/controllers/auth/register.controller.js";
import { User, OTP } from "../../../../src/modules/index.js";

// Patch the shared Twilio client prototype so SMS sends are intercepted
// without a real provider call (twilioClient is cached inside sms.service).
const twilioProbe = twilio("AC00000000000000000000000000000000", "token");
Object.defineProperty(Object.getPrototypeOf(twilioProbe), "messages", {
  get: () => ({ create: async () => ({ sid: "SM-mocked" }) }),
  configurable: true,
});

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("register", () => {
  it("returns 400 if a VERIFIED user already exists with that email", async () => {
    mock.method(User, "findOne", async () => ({
      id: 9,
      email: "alice@example.com",
      isVerified: true,
    }));

    const req = {
      body: {
        name: "Alice",
        email: "alice@example.com",
        password: "secret123",
        role: "Student",
      },
    };
    const res = createRes();

    await register(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /already exists with this email/i);
  });

  it("returns 400 if a VERIFIED user already exists with that phone number", async () => {
    mock.method(User, "findOne", async () => ({
      id: 9,
      email: null,
      phone: "+94771234567",
      isVerified: true,
    }));

    const req = {
      body: {
        name: "Alice",
        phone: "077 123 4567",
        password: "secret123",
        role: "Student",
      },
    };
    const res = createRes();

    await register(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(
      res.getBody().message,
      /already exists with this phone number/i,
    );
  });

  it("resumes registration for an UNVERIFIED existing user, updating details and issuing fresh OTP", async () => {
    mock.method(SESClient.prototype, "send", async () => ({
      MessageId: "mocked",
    }));
    mock.method(bcrypt, "genSalt", async () => "salt");
    mock.method(bcrypt, "hash", async () => "hashed");
    mock.method(crypto, "randomInt", () => 999888);

    const mockUnverifiedUser = {
      id: 15,
      email: "alice@example.com",
      phone: null,
      name: "Old Name",
      passwordHash: "oldHash",
      role: "Student",
      isVerified: false,
      save: mock.fn(async () => {}),
    };

    mock.method(User, "findOne", async () => mockUnverifiedUser);
    const otpUpdate = mock.fn(async () => [1]);
    mock.method(OTP, "update", otpUpdate);
    const otpCreate = mock.fn(async () => ({}));
    mock.method(OTP, "create", otpCreate);

    const req = {
      body: {
        name: "Alice Updated",
        email: "alice@example.com",
        password: "newPassword123",
        role: "Student",
      },
    };
    const res = createRes();

    await register(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(res.getBody().success, true);
    assert.equal(res.getBody().data.userId, 15);
    assert.equal(mockUnverifiedUser.save.mock.calls.length, 1);
    assert.equal(mockUnverifiedUser.name, "Alice Updated");
    assert.equal(mockUnverifiedUser.passwordHash, "hashed");

    // Invalidated previous OTPs
    assert.equal(otpUpdate.mock.calls.length, 1);
    assert.equal(otpUpdate.mock.calls[0].arguments[0].isUsed, true);

    // Created fresh OTP
    assert.equal(otpCreate.mock.calls.length, 1);
    assert.equal(otpCreate.mock.calls[0].arguments[0].code, "999888");
  });

  it("returns 201 and sends OTP by email on successful NEW user registration", async () => {
    mock.method(SESClient.prototype, "send", async () => ({
      MessageId: "mocked",
    }));
    mock.method(bcrypt, "genSalt", async () => "salt");
    mock.method(bcrypt, "hash", async () => "hashed");
    mock.method(crypto, "randomInt", () => 123456);
    mock.method(User, "findOne", async () => null);
    mock.method(User, "create", async (data) => ({ id: 1, ...data }));
    const otpCreate = mock.fn(async () => ({}));
    mock.method(OTP, "create", otpCreate);

    const req = {
      body: {
        name: "Alice",
        email: "alice@example.com",
        password: "secret123",
        role: "Student",
      },
    };
    const res = createRes();

    await register(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(res.getBody().success, true);
    assert.equal(res.getBody().data.userId, 1);
    assert.equal(otpCreate.mock.calls.length, 1);
    const otpArgs = otpCreate.mock.calls[0].arguments[0];
    assert.equal(otpArgs.code, "123456");
    assert.equal(otpArgs.type, "REGISTRATION");
  });

  it("returns 201 and sends OTP by SMS on successful phone registration", async () => {
    process.env.TWILIO_ACCOUNT_SID = "AC00000000000000000000000000000000";
    process.env.TWILIO_AUTH_TOKEN = "token";
    mock.method(bcrypt, "genSalt", async () => "salt");
    mock.method(bcrypt, "hash", async () => "hashed");
    mock.method(crypto, "randomInt", () => 654321);
    mock.method(User, "findOne", async () => null);
    mock.method(User, "create", async (data) => ({ id: 2, ...data }));
    mock.method(OTP, "create", async () => ({}));

    const req = {
      body: {
        name: "Bob",
        phone: "077 123 4567",
        password: "secret123",
        role: "Student",
      },
    };
    const res = createRes();

    await register(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(res.getBody().data.userId, 2);
    assert.equal(res.getBody().data.phone, "+94771234567");
  });

  it("returns 500 on unexpected error", async () => {
    mock.method(User, "findOne", async () => {
      throw new Error("boom");
    });

    const req = {
      body: {
        name: "Alice",
        email: "alice@example.com",
        password: "secret123",
        role: "Student",
      },
    };
    const res = createRes();

    await register(req, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().success, false);
    assert.equal(res.getBody().message, "Internal Server Error");
  });
});
