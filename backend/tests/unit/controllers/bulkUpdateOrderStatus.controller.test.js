import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { bulkUpdateOrderStatus } from "../../../src/controllers/orders/bulkUpdateOrderStatus.controller.js";
import { Order, Notification } from "../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

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

describe("bulkUpdateOrderStatus", () => {
  it("returns 400 if orderIds is missing or empty", async () => {
    const req = { body: { status: "Ready for Pickup" } };
    const res = createRes();

    await bulkUpdateOrderStatus(req, res);
    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /array of orderIds is required/i);

    req.body.orderIds = [];
    await bulkUpdateOrderStatus(req, res);
    assert.equal(res.getStatusCode(), 400);
  });

  it("returns 400 if status is invalid", async () => {
    const req = { body: { orderIds: [1], status: "INVALID" } };
    const res = createRes();

    await bulkUpdateOrderStatus(req, res);
    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Invalid status/i);
  });

  it("updates orders, sends notifications, and returns 200", async () => {
    const req = {
      user: { id: 1 },
      body: { orderIds: [1, 2], status: "Ready for Pickup" },
    };
    const res = createRes();

    const order1Update = mock.fn(async () => {});
    const order1 = {
      id: 1, orderId: "O1", buyerId: 2, sellerId: 1, status: "Pending",
      timeline: [], update: order1Update
    };

    const order2Update = mock.fn(async () => {});
    const order2 = {
      id: 2, orderId: "O2", buyerId: 3, sellerId: 1, status: "Ready for Pickup", // already in this status
      timeline: [], update: order2Update
    };

    mock.method(Order, "findAll", async () => [order1, order2]);

    const notifyFn = mock.fn(async () => ({}));
    mock.method(Notification, "create", notifyFn);
    mock.method(Notification, "findOne", async () => null);

    await bulkUpdateOrderStatus(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().updatedCount, 1); // Only order1 should be updated

    assert.equal(order1Update.mock.calls.length, 1);
    assert.equal(order2Update.mock.calls.length, 0);

    assert.equal(notifyFn.mock.calls.length, 1);
  });
});
