import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { updateOrderStatus } from "../../../src/controllers/orders/updateOrderStatus.controller.js";
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

describe("updateOrderStatus", () => {
  it("returns 404 if order is not found", async () => {
    const req = { params: { id: 999 }, user: { id: 1 }, body: {} };
    const res = createRes();

    mock.method(Order, "findByPk", async () => null);

    await updateOrderStatus(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().error, /Order not found/i);
  });

  it("returns 403 if user is not the seller", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 2 }, // seller is 1
      body: { status: "Ready for Pickup" },
    };
    const res = createRes();

    mock.method(Order, "findByPk", async () => ({ id: 1, sellerId: 1 }));

    await updateOrderStatus(req, res);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().error, /Unauthorized to update this order/i);
  });

  it("returns 200 without updating if status is unchanged", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 1 },
      body: { status: "Ready for Pickup" },
    };
    const res = createRes();

    const orderMock = {
      id: 1,
      sellerId: 1,
      status: "Ready for Pickup",
      update: mock.fn(async () => {}),
    };
    mock.method(Order, "findByPk", async () => orderMock);

    await updateOrderStatus(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(orderMock.update.mock.calls.length, 0);
  });

  it("returns 200, updates order and sends notification", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 1 },
      body: { status: "Order Completed", note: "Thanks!" },
    };
    const res = createRes();

    const updateFn = mock.fn(async () => {});
    const orderMock = {
      id: 1,
      orderId: "ORD-123",
      buyerId: 2,
      sellerId: 1,
      status: "Ready for Pickup",
      timeline: [],
      update: updateFn,
    };
    mock.method(Order, "findByPk", async () => orderMock);

    const notifyFn = mock.fn(async () => ({}));
    mock.method(Notification, "create", notifyFn);
    mock.method(Notification, "findOne", async () => null);

    await updateOrderStatus(req, res);

    assert.equal(res.getStatusCode(), 200);
    
    assert.equal(updateFn.mock.calls.length, 1);
    const updateArgs = updateFn.mock.calls[0].arguments[0];
    assert.equal(updateArgs.status, "Order Completed");
    assert.equal(updateArgs.timeline.length, 1);
    assert.equal(updateArgs.timeline[0].status, "Order Completed");
    assert.equal(updateArgs.timeline[0].note, "Thanks!");

    // Verify Notification.create was called via the service
    assert.equal(notifyFn.mock.calls.length, 1);
  });
});
