import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { createEventBooking } from "../../../../src/controllers/bookings/createEventBooking.controller.js";
import { ClubEventPost, EventBooking } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("createEventBooking", () => {
  it("returns 400 if user ID is missing", async () => {
    const req = { body: {} };
    const res = createRes();

    await createEventBooking(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /User ID is required/i);
  });

  it("returns 400 if eventId or tierId are missing", async () => {
    const req = {
      user: { id: 1 },
      body: { eventId: 1 }, // Missing tierId
    };
    const res = createRes();

    await createEventBooking(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Event ID and Tier ID are required/i);
  });

  it("returns 404 if event is not found", async () => {
    const req = {
      user: { id: 1 },
      body: { eventId: 999, tierId: "VIP" },
    };
    const res = createRes();

    mock.method(ClubEventPost, "findByPk", async () => null);

    await createEventBooking(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().error, /Event not found/i);
  });

  it("returns 400 if invalid tier is selected", async () => {
    const req = {
      user: { id: 1 },
      body: { eventId: 1, tierId: "NON_EXISTENT_TIER" },
    };
    const res = createRes();

    mock.method(ClubEventPost, "findByPk", async () => ({
      id: 1,
      tiers: [{ label: "VIP", price: 100 }],
    }));

    await createEventBooking(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Invalid tier selected/i);
  });

  it("returns 201 and creates booking for a paid tier", async () => {
    const req = {
      user: { id: 1 },
      body: { eventId: 1, tierId: "VIP", qty: 2 },
    };
    const res = createRes();

    mock.method(ClubEventPost, "findByPk", async () => ({
      id: 1,
      tiers: [{ label: "VIP", price: 100 }],
    }));

    const createFn = mock.fn(async (data) => ({
      ...data,
      id: 1,
    }));
    mock.method(EventBooking, "create", createFn);

    await createEventBooking(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(res.getBody().success, true);
    
    assert.equal(createFn.mock.calls.length, 1);
    const bookingArgs = createFn.mock.calls[0].arguments[0];
    assert.equal(bookingArgs.total, 200); // 100 * 2
    assert.equal(bookingArgs.status, "PENDING");
    assert.equal(bookingArgs.paymentStatus, "UNPAID");
  });

  it("returns 201 and creates booking for a free tier (price 0)", async () => {
    const req = {
      user: { id: 1 },
      body: { eventId: 1, tierId: "General", qty: 1 },
    };
    const res = createRes();

    mock.method(ClubEventPost, "findByPk", async () => ({
      id: 1,
      tiers: [{ label: "General", price: 0 }],
    }));

    const createFn = mock.fn(async (data) => ({
      ...data,
      id: 2,
    }));
    mock.method(EventBooking, "create", createFn);

    await createEventBooking(req, res);

    assert.equal(res.getStatusCode(), 201);
    
    const bookingArgs = createFn.mock.calls[0].arguments[0];
    assert.equal(bookingArgs.total, 0);
    assert.equal(bookingArgs.status, "CONFIRMED");
    assert.equal(bookingArgs.paymentStatus, "PAID");
  });
});
