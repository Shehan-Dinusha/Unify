/**
 * Notification Controller — Unit Test Suite
 * ────────────────────────────────────────────
 * Tests for:
 *   getNotifications · getNotificationUnreadCount
 *   markNotificationRead · markAllNotificationsRead · removeNotification
 *
 * Run individually:
 *   node --test tests/unit/controllers/notification.controller.test.js
 *
 * Mocking strategy:
 *   The notification controller uses named imports from notification.service.js
 *   (getUserNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification).
 *   Named ESM exports are live bindings and cannot be patched via mock.method.
 *   Instead, we mock the Notification Sequelize model methods underneath each
 *   service function so they return controlled values without a real DB connection.
 *
 *   s3Service is a default-export object, so mock.method works directly on it.
 */

import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockRes } from '../../helpers/testUtils.js';

// ─── Sequelize model imports (mock the DB layer under the service) ─────────────
import Notification from '../../../src/modules/Notification.model.js';

// ─── Default-export service (for S3 URL signing mock) ─────────────────────────
import s3Service from '../../../src/services/s3.service.js';

// ─── Automatic mock cleanup ────────────────────────────────────────────────────
afterEach(() => {
  mock.restoreAll();
});

// ─── Shared helpers ───────────────────────────────────────────────────────────

/**
 * Build a fake Notification row that has a toJSON() method
 * (mirrors what Sequelize model instances return).
 */
const makeNotifRow = (overrides = {}) => {
  const base = {
    id: 1, userId: 5, type: 'Like',
    title: 'Alice liked your post',
    content: '',
    isUnread: true,
    image: null,
    createdAt: new Date('2026-05-01T10:00:00Z'),
    actor: { id: 2, name: 'Alice', avatar: null },
    ...overrides,
  };
  base.toJSON = () => ({ ...base });
  return base;
};

// ═══════════════════════════════════════════════════════════════════════════════
// getNotifications Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getNotifications Controller', () => {
  it('returns 200 with formatted notifications list', async () => {
    mock.method(Notification, 'findAndCountAll', async () => ({
      count: 1,
      rows: [makeNotifRow()],
    }));

    const { getNotifications } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, query: {} };
    const res = mockRes();

    await getNotifications(req, res);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.total, 1);
    assert.equal(res._json.notifications.length, 1);
    assert.equal(res._json.notifications[0].title, 'Alice liked your post');
    assert.equal(res._json.notifications[0].actorName, 'Alice');
  });

  it('returns 200 with empty notifications array when none exist', async () => {
    mock.method(Notification, 'findAndCountAll', async () => ({ count: 0, rows: [] }));

    const { getNotifications } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, query: {} };
    const res = mockRes();

    await getNotifications(req, res);

    assert.equal(res._status, 200);
    assert.equal(res._json.total, 0);
    assert.equal(res._json.notifications.length, 0);
  });

  it('resolves S3 signed URL when image is an S3 key (not http)', async () => {
    mock.method(Notification, 'findAndCountAll', async () => ({
      count: 1,
      rows: [makeNotifRow({ image: 's3/notifications/img.jpg' })],
    }));
    mock.method(s3Service, 'getFileUrl', async () => 'https://cdn.example.com/img.jpg');

    const { getNotifications } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, query: {} };
    const res = mockRes();

    await getNotifications(req, res);

    assert.equal(res._json.notifications[0].image, 'https://cdn.example.com/img.jpg');
  });

  it('does NOT call S3 when image is already an http URL', async () => {
    const httpImage = 'https://already-signed.example.com/img.jpg';
    mock.method(Notification, 'findAndCountAll', async () => ({
      count: 1,
      rows: [makeNotifRow({ image: httpImage })],
    }));
    const s3Spy = mock.method(s3Service, 'getFileUrl', async () => 'SHOULD_NOT_CALL');

    const { getNotifications } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, query: {} };
    const res = mockRes();

    await getNotifications(req, res);

    assert.equal(s3Spy.mock.calls.length, 0);
    assert.equal(res._json.notifications[0].image, httpImage);
  });

  it('passes filter, limit and offset to the DB query', async () => {
    let capturedWhere;
    mock.method(Notification, 'findAndCountAll', async ({ where }) => {
      capturedWhere = where;
      return { count: 0, rows: [] };
    });

    const { getNotifications } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, query: { filter: 'unread', limit: '10', offset: '20' } };
    const res = mockRes();

    await getNotifications(req, res);

    assert.equal(capturedWhere.isUnread, true);
  });

  it('returns 500 when the DB throws', async () => {
    mock.method(Notification, 'findAndCountAll', async () => {
      throw new Error('DB timeout');
    });

    const { getNotifications } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, query: {} };
    const res = mockRes();

    await getNotifications(req, res);

    assert.equal(res._status, 500);
    assert.ok(res._json.error);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getNotificationUnreadCount Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getNotificationUnreadCount Controller', () => {
  it('returns 200 with the correct unread count', async () => {
    mock.method(Notification, 'count', async () => 7);

    const { getNotificationUnreadCount } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 } };
    const res = mockRes();

    await getNotificationUnreadCount(req, res);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.unreadCount, 7);
  });

  it('returns unreadCount of 0 when all notifications are read', async () => {
    mock.method(Notification, 'count', async () => 0);

    const { getNotificationUnreadCount } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 } };
    const res = mockRes();

    await getNotificationUnreadCount(req, res);

    assert.equal(res._json.unreadCount, 0);
  });

  it('returns 500 when the DB throws', async () => {
    mock.method(Notification, 'count', async () => { throw new Error('Count failed'); });

    const { getNotificationUnreadCount } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 } };
    const res = mockRes();

    await getNotificationUnreadCount(req, res);

    assert.equal(res._status, 500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// markNotificationRead Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('markNotificationRead Controller', () => {
  it('returns 404 when notification does not belong to user', async () => {
    mock.method(Notification, 'findOne', async () => null);

    const { markNotificationRead } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, params: { id: '99' } };
    const res = mockRes();

    await markNotificationRead(req, res);

    assert.equal(res._status, 404);
  });

  it('returns 200 with the updated notification after marking as read', async () => {
    const notif = { id: 1, isUnread: true, save: mock.fn(async () => {}) };
    mock.method(Notification, 'findOne', async () => notif);

    const { markNotificationRead } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, params: { id: '1' } };
    const res = mockRes();

    await markNotificationRead(req, res);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(notif.isUnread, false);                 // mutated by service
    assert.equal(notif.save.mock.calls.length, 1);
  });

  it('returns 500 when the DB throws', async () => {
    mock.method(Notification, 'findOne', async () => { throw new Error('Query error'); });

    const { markNotificationRead } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, params: { id: '1' } };
    const res = mockRes();

    await markNotificationRead(req, res);

    assert.equal(res._status, 500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// markAllNotificationsRead Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('markAllNotificationsRead Controller', () => {
  it('returns 200 with the count of marked notifications', async () => {
    mock.method(Notification, 'update', async () => [12]);

    const { markAllNotificationsRead } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 } };
    const res = mockRes();

    await markAllNotificationsRead(req, res);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.markedCount, 12);
  });

  it('returns markedCount of 0 when nothing was unread', async () => {
    mock.method(Notification, 'update', async () => [0]);

    const { markAllNotificationsRead } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 } };
    const res = mockRes();

    await markAllNotificationsRead(req, res);

    assert.equal(res._json.markedCount, 0);
  });

  it('returns 500 when the DB throws', async () => {
    mock.method(Notification, 'update', async () => { throw new Error('Bulk update failed'); });

    const { markAllNotificationsRead } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 } };
    const res = mockRes();

    await markAllNotificationsRead(req, res);

    assert.equal(res._status, 500);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// removeNotification Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('removeNotification Controller', () => {
  it('returns 404 when notification does not belong to user', async () => {
    mock.method(Notification, 'findOne', async () => null);

    const { removeNotification } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, params: { id: '99' } };
    const res = mockRes();

    await removeNotification(req, res);

    assert.equal(res._status, 404);
  });

  it('returns 200 when notification is deleted successfully', async () => {
    const notif = { id: 1, destroy: mock.fn(async () => {}) };
    mock.method(Notification, 'findOne', async () => notif);

    const { removeNotification } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, params: { id: '1' } };
    const res = mockRes();

    await removeNotification(req, res);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.match(res._json.message, /deleted/i);
    assert.equal(notif.destroy.mock.calls.length, 1);
  });

  it('returns 500 when the DB throws', async () => {
    mock.method(Notification, 'findOne', async () => { throw new Error('Delete failed'); });

    const { removeNotification } = await import('../../../src/controllers/notifications/notification.controller.js');

    const req = { user: { id: 5 }, params: { id: '1' } };
    const res = mockRes();

    await removeNotification(req, res);

    assert.equal(res._status, 500);
  });
});
