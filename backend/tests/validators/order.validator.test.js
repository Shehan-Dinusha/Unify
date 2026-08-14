import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getError, getErrorWithParams } from '../helpers/testUtils.js';
import {
  createOrderValidator,
  updateOrderStatusValidator,
  bulkUpdateOrderStatusValidator,
  orderParamsValidator,
} from '../../src/validators/order.validator.js';

describe('createOrderValidator', () => {
  it('accepts valid order', async () => {
    assert.equal(await getError(createOrderValidator, { postId: 1, qty: 2, paymentMethod: 'STRIPE' }), null);
  });

  it('accepts cash on pickup', async () => {
    assert.equal(await getError(createOrderValidator, { postId: 1, paymentMethod: 'CASH_ON_PICKUP' }), null);
  });

  it('accepts order without qty', async () => {
    assert.equal(await getError(createOrderValidator, { postId: 1, paymentMethod: 'STRIPE' }), null);
  });

  it('rejects missing postId', async () => {
    assert.match(await getError(createOrderValidator, { paymentMethod: 'STRIPE' }), /Post ID is required/i);
  });

  it('rejects non-integer postId', async () => {
    assert.match(await getError(createOrderValidator, { postId: 'x', paymentMethod: 'STRIPE' }), /Post ID must be an integer/i);
  });

  it('rejects missing paymentMethod', async () => {
    assert.match(await getError(createOrderValidator, { postId: 1 }), /Payment method is required/i);
  });

  it('rejects invalid paymentMethod', async () => {
    assert.match(await getError(createOrderValidator, { postId: 1, paymentMethod: 'PAYPAL' }), /Invalid payment method/i);
  });

  it('rejects qty below 1', async () => {
    assert.match(await getError(createOrderValidator, { postId: 1, paymentMethod: 'STRIPE', qty: 0 }), /Quantity must be at least 1/i);
  });
});

describe('updateOrderStatusValidator', () => {
  it('accepts a valid status', async () => {
    assert.equal(await getError(updateOrderStatusValidator, { status: 'Order Completed' }), null);
  });

  it('accepts status with optional note', async () => {
    assert.equal(await getError(updateOrderStatusValidator, { status: 'Ready for Pickup', note: 'See you soon' }), null);
  });

  it('rejects missing status', async () => {
    assert.match(await getError(updateOrderStatusValidator, {}), /Status is required/i);
  });
});

describe('bulkUpdateOrderStatusValidator', () => {
  it('accepts valid payload', async () => {
    assert.equal(await getError(bulkUpdateOrderStatusValidator, { orderIds: [1, 2], status: 'Seller Confirmed' }), null);
  });

  it('rejects missing orderIds', async () => {
    assert.match(await getError(bulkUpdateOrderStatusValidator, { status: 'Seller Confirmed' }), /Order IDs are required/i);
  });

  it('rejects empty orderIds', async () => {
    assert.match(await getError(bulkUpdateOrderStatusValidator, { orderIds: [], status: 'Seller Confirmed' }), /non-empty array/i);
  });

  it('rejects non-integer order id', async () => {
    assert.match(await getError(bulkUpdateOrderStatusValidator, { orderIds: [1, 'x'], status: 'Seller Confirmed' }), /Each Order ID must be an integer/i);
  });

  it('rejects disallowed status', async () => {
    assert.match(await getError(bulkUpdateOrderStatusValidator, { orderIds: [1], status: 'PENDING' }), /Invalid status/i);
  });
});

describe('orderParamsValidator', () => {
  it('accepts an integer id', async () => {
    assert.equal(await getErrorWithParams(orderParamsValidator, { id: '5' }), null);
  });

  it('rejects missing id', async () => {
    assert.match(await getErrorWithParams(orderParamsValidator, {}), /Order ID is required/i);
  });

  it('rejects non-integer id', async () => {
    assert.match(await getErrorWithParams(orderParamsValidator, { id: 'abc' }), /Order ID must be an integer/i);
  });
});
