import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { getOrderDetails } from "../../../../src/controllers/orders/getOrderDetails.controller.js";
import { Order } from "../../../../src/modules/index.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

const makeOrder = (overrides = {}) => {
  const row = {
    id: 1,
    clubProduct: { id: 2, name: "Hoodie", images: [], price: 25 },
    seller: { id: 3, name: "Club Shop", email: "shop@example.com", avatar: null },
    transaction: { id: 4, status: "SUCCESS", amount: 25, createdAt: new Date() },
    ...overrides,
  };
  return { ...row, toJSON: () => ({ ...row }) };
};

describe("getOrderDetails", () => {
  it("returns 200 with the order details", async () => {
    mock.method(Order, "findByPk", async () => makeOrder());

    const req = { params: { id: "1" } };
    const res = createRes();

    await getOrderDetails(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.equal(res.getBody().order.id, 1);
    assert.equal(res.getBody().order.seller.name, "Club Shop");
  });

  it("leaves already-absolute image URLs untouched", async () => {
    mock.method(Order, "findByPk", async () =>
      makeOrder({
        clubProduct: { id: 2, name: "Hoodie", images: ["https://cdn.example.com/a.png"], price: 25 },
      })
    );

    const req = { params: { id: "1" } };
    const res = createRes();

    await getOrderDetails(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.deepEqual(res.getBody().order.clubProduct.images, ["https://cdn.example.com/a.png"]);
  });

  it("returns 500 on unexpected error", async () => {
    mock.method(Order, "findByPk", async () => {
      throw new Error("boom");
    });

    const req = { params: { id: "1" } };
    const res = createRes();

    await getOrderDetails(req, res);

    assert.equal(res.getStatusCode(), 500);
    assert.equal(res.getBody().error, "boom");
  });
});
