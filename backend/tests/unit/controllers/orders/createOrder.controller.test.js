import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { createOrder } from "../../../../src/controllers/orders/createOrder.controller.js";
import { User, ClubProductPost, Order } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("createOrder", () => {
  it("returns 400 if user ID is missing", async () => {
    const req = { body: {} };
    const res = createRes();

    await createOrder(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /User ID is required/i);
  });

  it("returns 403 if user is not a Student", async () => {
    const req = {
      user: { id: 1 },
      body: { postId: 1 },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => ({ id: 1, role: "Club" }));

    await createOrder(req, res);

    assert.equal(res.getStatusCode(), 403);
    assert.match(res.getBody().error, /Only students can make orders/i);
  });

  it("returns 400 if post ID is missing", async () => {
    const req = {
      user: { id: 1 },
      body: {}, // missing postId
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => ({ id: 1, role: "Student" }));

    await createOrder(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().error, /Post ID is required/i);
  });

  it("returns 404 if post is not found", async () => {
    const req = {
      user: { id: 1 },
      body: { postId: 999 },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => ({ id: 1, role: "Student" }));
    mock.method(ClubProductPost, "findByPk", async () => null);

    await createOrder(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.match(res.getBody().error, /Club product post not found/i);
  });

  it("returns 201 and creates the order on success", async () => {
    const req = {
      user: { id: 1 },
      body: { postId: 1, qty: 2, paymentMethod: "CARD" },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => ({ id: 1, role: "Student" }));
    mock.method(ClubProductPost, "findByPk", async () => ({
      id: 1,
      price: 50,
      authorId: 2,
      pickupNote: "At the club room",
    }));

    const createFn = mock.fn(async (data) => ({
      ...data,
      id: 100,
    }));
    mock.method(Order, "create", createFn);

    await createOrder(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(res.getBody().success, true);
    
    assert.equal(createFn.mock.calls.length, 1);
    const orderArgs = createFn.mock.calls[0].arguments[0];
    assert.equal(orderArgs.subtotal, 100); // 50 * 2
    assert.equal(orderArgs.total, 100); // subtotal + 0 fees
    assert.equal(orderArgs.sellerId, 2);
    assert.equal(orderArgs.pickupLocation, "At the club room");
    assert.equal(orderArgs.status, "PENDING");
  });
});
