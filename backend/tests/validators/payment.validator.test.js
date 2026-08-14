import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getError } from '../helpers/testUtils.js';
import { checkoutSessionValidator } from '../../src/validators/payment.validator.js';

describe('checkoutSessionValidator', () => {
  const valid = { orderId: 'ORD-1001', amount: '50.00', productName: 'Test Product' };

  it('accepts an orderId-based checkout', async () => {
    assert.equal(await getError(checkoutSessionValidator, valid), null);
  });

  it('accepts a bookingId-based checkout', async () => {
    assert.equal(await getError(checkoutSessionValidator, { bookingId: 'BKG-9', amount: '20', productName: 'Event Ticket' }), null);
  });

  it('rejects when neither orderId nor bookingId is provided', async () => {
    assert.match(await getError(checkoutSessionValidator, { amount: '50', productName: 'X' }), /Invalid value/i);
  });

  it('rejects missing amount', async () => {
    assert.match(await getError(checkoutSessionValidator, { orderId: 'ORD-1', productName: 'X' }), /Amount is required/i);
  });

  it('rejects non-numeric amount', async () => {
    assert.match(await getError(checkoutSessionValidator, { orderId: 'ORD-1', amount: 'abc', productName: 'X' }), /Amount must be a number/i);
  });

  it('rejects amount of zero or less', async () => {
    assert.match(await getError(checkoutSessionValidator, { orderId: 'ORD-1', amount: '0', productName: 'X' }), /Amount must be greater than zero/i);
  });

  it('rejects missing productName', async () => {
    assert.match(await getError(checkoutSessionValidator, { orderId: 'ORD-1', amount: '50' }), /Product name is required/i);
  });

  it('rejects invalid successUrl', async () => {
    assert.match(await getError(checkoutSessionValidator, { ...valid, successUrl: 'foo bar' }), /Invalid success URL/i);
  });

  it('rejects invalid cancelUrl', async () => {
    assert.match(await getError(checkoutSessionValidator, { ...valid, cancelUrl: 'foo bar' }), /Invalid cancel URL/i);
  });
});
