import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getError, getErrorWithParams } from '../helpers/testUtils.js';
import {
  createBookingValidator,
  updateBookingStatusValidator,
  bulkUpdateBookingStatusValidator,
  bookingParamsValidator,
} from '../../src/validators/booking.validator.js';

describe('createBookingValidator', () => {
  it('accepts valid booking', async () => {
    assert.equal(await getError(createBookingValidator, { eventId: 1, tierId: 'VIP', qty: 2 }), null);
  });

  it('accepts booking without qty', async () => {
    assert.equal(await getError(createBookingValidator, { eventId: 1, tierId: 'VIP' }), null);
  });

  it('rejects missing eventId', async () => {
    assert.match(await getError(createBookingValidator, { tierId: 'VIP' }), /Event ID is required/i);
  });

  it('rejects non-integer eventId', async () => {
    assert.match(await getError(createBookingValidator, { eventId: 'abc', tierId: 'VIP' }), /Event ID must be an integer/i);
  });

  it('rejects missing tierId', async () => {
    assert.match(await getError(createBookingValidator, { eventId: 1 }), /Tier ID is required/i);
  });

  it('rejects qty below 1', async () => {
    assert.match(await getError(createBookingValidator, { eventId: 1, tierId: 'VIP', qty: 0 }), /Quantity must be at least 1/i);
  });
});

describe('updateBookingStatusValidator', () => {
  it('accepts a valid status', async () => {
    assert.equal(await getError(updateBookingStatusValidator, { status: 'ATTENDED' }), null);
  });

  it('rejects missing status', async () => {
    assert.match(await getError(updateBookingStatusValidator, {}), /Status is required/i);
  });
});

describe('bulkUpdateBookingStatusValidator', () => {
  const valid = { bookingIds: [1, 2], status: 'ATTENDED' };

  it('accepts valid payload', async () => {
    assert.equal(await getError(bulkUpdateBookingStatusValidator, valid), null);
  });

  it('rejects missing bookingIds', async () => {
    assert.match(await getError(bulkUpdateBookingStatusValidator, { status: 'ATTENDED' }), /Booking IDs are required/i);
  });

  it('rejects empty bookingIds array', async () => {
    assert.match(await getError(bulkUpdateBookingStatusValidator, { bookingIds: [], status: 'ATTENDED' }), /non-empty array/i);
  });

  it('rejects non-integer booking id', async () => {
    assert.match(await getError(bulkUpdateBookingStatusValidator, { bookingIds: [1, 'x'], status: 'ATTENDED' }), /Each Booking ID must be an integer/i);
  });

  it('rejects disallowed status', async () => {
    assert.match(await getError(bulkUpdateBookingStatusValidator, { bookingIds: [1], status: 'PAID' }), /Invalid status/i);
  });
});

describe('bookingParamsValidator', () => {
  it('accepts an integer id', async () => {
    assert.equal(await getErrorWithParams(bookingParamsValidator, { id: '5' }), null);
  });

  it('rejects missing id', async () => {
    assert.match(await getErrorWithParams(bookingParamsValidator, {}), /Booking ID is required/i);
  });

  it('rejects non-integer id', async () => {
    assert.match(await getErrorWithParams(bookingParamsValidator, { id: 'abc' }), /Booking ID must be an integer/i);
  });
});
