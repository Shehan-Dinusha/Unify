import { afterEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import {
  Order,
  EventBooking,
  Wallet,
  ClubEventPost,
} from '../../../src/modules/index.js';
import {
  processOrderPayment,
  processBookingPayment,
} from '../../../src/services/payment.service.js';

afterEach(() => {
  mock.restoreAll();
});

describe('processOrderPayment', () => {
  it('returns safely when order is not found', async () => {
    const findOrder = mock.method(Order, 'findOne', async () => null);
    const findWallet = mock.method(Wallet, 'findOne', async () => null);

    await processOrderPayment('ORD-404', { id: 'pi_missing_order' });

    assert.equal(findOrder.mock.calls.length, 1);
    assert.deepEqual(findOrder.mock.calls[0].arguments[0], {
      where: { orderId: 'ORD-404' },
    });
    assert.equal(findWallet.mock.calls.length, 0);
  });

  it('updates order status, timeline, and saves the order', async () => {
    const order = {
      id: 1,
      orderId: 'ORD-1001',
      sellerId: 20,
      total: '1500.00',
      status: 'PENDING',
      timeline: [{ status: 'PENDING', timestamp: new Date('2026-01-01T00:00:00Z') }],
      save: mock.fn(async () => {}),
    };

    mock.method(Order, 'findOne', async () => order);
    const findWallet = mock.method(Wallet, 'findOne', async () => null);

    await processOrderPayment('ORD-1001', { id: 'pi_order_1001' });

    assert.equal(order.status, 'Order Placed');
    assert.equal(order.timeline.length, 2);
    assert.equal(order.timeline[1].status, 'Order Placed');
    assert.ok(order.timeline[1].timestamp instanceof Date);
    assert.equal(order.save.mock.calls.length, 1);
    assert.equal(findWallet.mock.calls.length, 1);
    assert.deepEqual(findWallet.mock.calls[0].arguments[0], {
      where: { userId: 20 },
    });
  });

  it('starts a new order timeline when existing timeline is not an array', async () => {
    const order = {
      id: 2,
      orderId: 'ORD-1002',
      sellerId: 21,
      total: 500,
      status: 'PENDING',
      timeline: null,
      save: mock.fn(async () => {}),
    };

    mock.method(Order, 'findOne', async () => order);
    mock.method(Wallet, 'findOne', async () => null);

    await processOrderPayment('ORD-1002', { id: 'pi_order_1002' });

    assert.equal(order.timeline.length, 1);
    assert.equal(order.timeline[0].status, 'Order Placed');
    assert.equal(order.save.mock.calls.length, 1);
  });
});

describe('processBookingPayment', () => {
  it('returns safely when booking is not found', async () => {
    const findBooking = mock.method(EventBooking, 'findOne', async () => null);
    const findWallet = mock.method(Wallet, 'findOne', async () => null);

    await processBookingPayment('BKG-404', { id: 'pi_missing_booking' });

    assert.equal(findBooking.mock.calls.length, 1);
    assert.deepEqual(findBooking.mock.calls[0].arguments[0], {
      where: { bookingId: 'BKG-404' },
      include: [{ model: ClubEventPost, as: 'event' }],
    });
    assert.equal(findWallet.mock.calls.length, 0);
  });

  it('updates booking status, payment status, timeline, and saves the booking', async () => {
    const booking = {
      id: 10,
      bookingId: 'BKG-1001',
      total: '2500.00',
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      timeline: [{ status: 'PENDING', timestamp: new Date('2026-01-01T00:00:00Z') }],
      event: { authorId: 30, name: 'Tech Meetup' },
      save: mock.fn(async () => {}),
    };

    mock.method(EventBooking, 'findOne', async () => booking);
    const findWallet = mock.method(Wallet, 'findOne', async () => null);

    await processBookingPayment('BKG-1001', { id: 'pi_booking_1001' });

    assert.equal(booking.status, 'CONFIRMED');
    assert.equal(booking.paymentStatus, 'PAID');
    assert.equal(booking.timeline.length, 2);
    assert.equal(booking.timeline[1].status, 'CONFIRMED');
    assert.ok(booking.timeline[1].timestamp instanceof Date);
    assert.equal(booking.save.mock.calls.length, 1);
    assert.equal(findWallet.mock.calls.length, 1);
    assert.deepEqual(findWallet.mock.calls[0].arguments[0], {
      where: { userId: 30 },
    });
  });

  it('returns after saving when booking has no event owner', async () => {
    const booking = {
      id: 11,
      bookingId: 'BKG-1002',
      total: 1200,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      timeline: [],
      event: null,
      save: mock.fn(async () => {}),
    };

    mock.method(EventBooking, 'findOne', async () => booking);
    const findWallet = mock.method(Wallet, 'findOne', async () => null);

    await processBookingPayment('BKG-1002', { id: 'pi_booking_1002' });

    assert.equal(booking.status, 'CONFIRMED');
    assert.equal(booking.paymentStatus, 'PAID');
    assert.equal(booking.timeline.length, 1);
    assert.equal(booking.timeline[0].status, 'CONFIRMED');
    assert.equal(booking.save.mock.calls.length, 1);
    assert.equal(findWallet.mock.calls.length, 0);
  });

  it('starts a new booking timeline when existing timeline is not an array', async () => {
    const booking = {
      id: 12,
      bookingId: 'BKG-1003',
      total: 900,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      timeline: undefined,
      event: null,
      save: mock.fn(async () => {}),
    };

    mock.method(EventBooking, 'findOne', async () => booking);
    mock.method(Wallet, 'findOne', async () => null);

    await processBookingPayment('BKG-1003', { id: 'pi_booking_1003' });

    assert.equal(booking.timeline.length, 1);
    assert.equal(booking.timeline[0].status, 'CONFIRMED');
    assert.equal(booking.save.mock.calls.length, 1);
  });
});
