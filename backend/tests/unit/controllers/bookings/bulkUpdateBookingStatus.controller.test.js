import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { bulkUpdateBookingStatus } from "../../../../src/controllers/bookings/bulkUpdateBookingStatus.controller.js";
import { EventBooking } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("bulkUpdateBookingStatus", () => {
  it("returns 400 if bookingIds array is missing or empty", async () => {
    const req = { body: { status: "ATTENDED" } };
    const res = createRes();

    await bulkUpdateBookingStatus(req, res);
    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /An array of bookingIds is required/i);

    req.body.bookingIds = [];
    await bulkUpdateBookingStatus(req, res);
    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /An array of bookingIds is required/i);
  });

  it("returns 400 if status is missing", async () => {
    const req = { body: { bookingIds: [1, 2] } };
    const res = createRes();

    await bulkUpdateBookingStatus(req, res);
    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Status is required/i);
  });

  it("returns 400 if status is not allowed", async () => {
    const req = { body: { bookingIds: [1, 2], status: "INVALID_STATUS" } };
    const res = createRes();

    await bulkUpdateBookingStatus(req, res);
    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Invalid status/i);
  });

  it("returns 200 and updates bookings on success", async () => {
    const req = { body: { bookingIds: [1, 2, 3], status: "ATTENDED" } };
    const res = createRes();

    const updateFn = mock.fn(async () => [3]); // Returns array with count
    mock.method(EventBooking, "update", updateFn);

    await bulkUpdateBookingStatus(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.equal(res.getBody().updatedCount, 3);
    
    assert.equal(updateFn.mock.calls.length, 1);
    const callArgs = updateFn.mock.calls[0].arguments;
    assert.deepEqual(callArgs[0], { status: "ATTENDED" });
    assert.deepEqual(callArgs[1].where.id, [1, 2, 3]);
  });
});
