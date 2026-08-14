/**
 * Newsfeed Controller — Unit Test Suite
 * ───────────────────────────────────────
 * Tests for:
 *   getEventsToday · getNewAnnouncements · getMarketplaceItemsToday
 *
 * Run individually:
 *   node --test tests/unit/controllers/newsfeed.controller.test.js
 *
 * Mocking strategy:
 *   These controllers use named imports from utilities (resolveAssetUrl,
 *   resolveAvatarUrl) which are ESM live bindings.  Instead of trying to
 *   patch them we mock the underlying s3Service default-export so the asset
 *   resolver receives no S3 key (we pass posts with null/empty images),
 *   which means resolveAssetUrl/resolveAvatarUrl return immediately without
 *   hitting the network.  Sequelize model findAll is mocked as usual.
 */

import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mockRes } from '../../helpers/testUtils.js';

// ─── Model imports ─────────────────────────────────────────────────────────────
import { ClubEventPost, NormalPost, ClubProductPost } from '../../../src/modules/index.js';

// ─── S3 default export (mock getFileUrl / getPublicUrl) ───────────────────────
import s3Service from '../../../src/services/s3.service.js';

afterEach(() => {
  mock.restoreAll();
});

// ─── Post factories (use null images / avatars so resolvers return fast) ────────

const makeEvent = (overrides = {}) => ({
  id: 1,
  title: 'Hackathon 2026',
  date: new Date().toLocaleDateString('en-CA'),
  images: [],
  coverImage: null,
  author: { id: 10, name: 'Tech Club', email: 'tech@uni.edu', avatar: null, role: 'club' },
  ...overrides,
});

const makeAnnouncement = (overrides = {}) => ({
  id: 1,
  title: 'Welcome Back',
  category: 'GENERAL',
  images: [],
  coverImage: null,
  author: { id: 5, name: 'Admin User', email: 'admin@uni.edu', avatar: null, role: 'admin' },
  ...overrides,
});

const makeProduct = (overrides = {}) => ({
  id: 1,
  name: 'Club T-Shirt',
  price: 1500,
  images: [],
  coverImage: null,
  author: { id: 10, name: 'Art Club', email: 'art@uni.edu', avatar: null, role: 'club' },
  ...overrides,
});

// ═══════════════════════════════════════════════════════════════════════════════
// getEventsToday Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getEventsToday Controller', () => {
  it('returns 200 with events list', async () => {
    mock.method(ClubEventPost, 'findAll', async () => [makeEvent()]);

    const { getEventsToday } = await import('../../../src/controllers/newsfeed/getEventsToday.controller.js');

    const res = mockRes();
    await getEventsToday({}, res);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.events.length, 1);
    assert.equal(res._json.events[0].title, 'Hackathon 2026');
  });

  it('tags every event with postType "club-event"', async () => {
    mock.method(ClubEventPost, 'findAll', async () => [
      makeEvent(),
      makeEvent({ id: 2, title: 'Design Workshop' }),
    ]);

    const { getEventsToday } = await import('../../../src/controllers/newsfeed/getEventsToday.controller.js');

    const res = mockRes();
    await getEventsToday({}, res);

    for (const event of res._json.events) {
      assert.equal(event.postType, 'club-event');
    }
  });

  it('returns 200 with empty events array when nothing is scheduled today', async () => {
    mock.method(ClubEventPost, 'findAll', async () => []);

    const { getEventsToday } = await import('../../../src/controllers/newsfeed/getEventsToday.controller.js');

    const res = mockRes();
    await getEventsToday({}, res);

    assert.equal(res._status, 200);
    assert.deepEqual(res._json.events, []);
  });

  it('resolves a cover image via s3Service.getPublicUrl when folder is "posts"', async () => {
    mock.method(ClubEventPost, 'findAll', async () => [
      makeEvent({ coverImage: 'posts/cover-image.jpg' }),
    ]);
    // getPublicUrl is called synchronously (no S3 presign needed for public folders)
    // We don't need to mock it; asserting the resolved URL starts with 's3.amazonaws.com'
    const res = mockRes();

    const { getEventsToday } = await import('../../../src/controllers/newsfeed/getEventsToday.controller.js');
    await getEventsToday({}, res);

    assert.equal(res._status, 200);
    assert.ok(res._json.events[0].coverImage.includes('s3.amazonaws.com'));
  });

  it('returns 500 when the DB throws', async () => {
    mock.method(ClubEventPost, 'findAll', async () => { throw new Error('DB error'); });

    const { getEventsToday } = await import('../../../src/controllers/newsfeed/getEventsToday.controller.js');

    const res = mockRes();
    await getEventsToday({}, res);

    assert.equal(res._status, 500);
    assert.equal(res._json.success, false);
    assert.ok(res._json.error);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getNewAnnouncements Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getNewAnnouncements Controller', () => {
  it('returns 200 with announcements list', async () => {
    mock.method(NormalPost, 'findAll', async () => [makeAnnouncement()]);

    const { getNewAnnouncements } = await import('../../../src/controllers/newsfeed/getNewAnnouncements.controller.js');

    const res = mockRes();
    await getNewAnnouncements({}, res);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.announcements.length, 1);
    assert.equal(res._json.announcements[0].title, 'Welcome Back');
  });

  it('tags GENERAL category posts as postType "normal"', async () => {
    mock.method(NormalPost, 'findAll', async () => [makeAnnouncement({ category: 'GENERAL' })]);

    const { getNewAnnouncements } = await import('../../../src/controllers/newsfeed/getNewAnnouncements.controller.js');

    const res = mockRes();
    await getNewAnnouncements({}, res);

    assert.equal(res._json.announcements[0].postType, 'normal');
  });

  it('tags FOOD category posts as postType "food-cafe"', async () => {
    mock.method(NormalPost, 'findAll', async () => [makeAnnouncement({ category: 'FOOD' })]);

    const { getNewAnnouncements } = await import('../../../src/controllers/newsfeed/getNewAnnouncements.controller.js');

    const res = mockRes();
    await getNewAnnouncements({}, res);

    assert.equal(res._json.announcements[0].postType, 'food-cafe');
  });

  it('tags SELF_EMPLOYED category posts as postType "services"', async () => {
    mock.method(NormalPost, 'findAll', async () => [makeAnnouncement({ category: 'SELF_EMPLOYED' })]);

    const { getNewAnnouncements } = await import('../../../src/controllers/newsfeed/getNewAnnouncements.controller.js');

    const res = mockRes();
    await getNewAnnouncements({}, res);

    assert.equal(res._json.announcements[0].postType, 'services');
  });

  it('returns 200 with empty array when no announcements today', async () => {
    mock.method(NormalPost, 'findAll', async () => []);

    const { getNewAnnouncements } = await import('../../../src/controllers/newsfeed/getNewAnnouncements.controller.js');

    const res = mockRes();
    await getNewAnnouncements({}, res);

    assert.equal(res._status, 200);
    assert.deepEqual(res._json.announcements, []);
  });

  it('returns 500 when the DB throws', async () => {
    mock.method(NormalPost, 'findAll', async () => { throw new Error('Sequelize error'); });

    const { getNewAnnouncements } = await import('../../../src/controllers/newsfeed/getNewAnnouncements.controller.js');

    const res = mockRes();
    await getNewAnnouncements({}, res);

    assert.equal(res._status, 500);
    assert.equal(res._json.success, false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getMarketplaceItemsToday Controller
// ═══════════════════════════════════════════════════════════════════════════════

describe('getMarketplaceItemsToday Controller', () => {
  it('returns 200 with marketplace items list', async () => {
    mock.method(ClubProductPost, 'findAll', async () => [makeProduct()]);

    const { getMarketplaceItemsToday } = await import('../../../src/controllers/newsfeed/getMarketplaceItemsToday.controller.js');

    const res = mockRes();
    await getMarketplaceItemsToday({}, res);

    assert.equal(res._status, 200);
    assert.equal(res._json.success, true);
    assert.equal(res._json.items.length, 1);
    assert.equal(res._json.items[0].name, 'Club T-Shirt');
  });

  it('tags every item with postType "club-product"', async () => {
    mock.method(ClubProductPost, 'findAll', async () => [
      makeProduct(),
      makeProduct({ id: 2, name: 'Hoodie' }),
    ]);

    const { getMarketplaceItemsToday } = await import('../../../src/controllers/newsfeed/getMarketplaceItemsToday.controller.js');

    const res = mockRes();
    await getMarketplaceItemsToday({}, res);

    for (const item of res._json.items) {
      assert.equal(item.postType, 'club-product');
    }
  });

  it('returns 200 with empty array when no marketplace items were listed today', async () => {
    mock.method(ClubProductPost, 'findAll', async () => []);

    const { getMarketplaceItemsToday } = await import('../../../src/controllers/newsfeed/getMarketplaceItemsToday.controller.js');

    const res = mockRes();
    await getMarketplaceItemsToday({}, res);

    assert.equal(res._status, 200);
    assert.deepEqual(res._json.items, []);
  });

  it('returns 500 when the DB throws', async () => {
    mock.method(ClubProductPost, 'findAll', async () => { throw new Error('Timeout'); });

    const { getMarketplaceItemsToday } = await import('../../../src/controllers/newsfeed/getMarketplaceItemsToday.controller.js');

    const res = mockRes();
    await getMarketplaceItemsToday({}, res);

    assert.equal(res._status, 500);
    assert.equal(res._json.success, false);
    assert.ok(res._json.error);
  });
});
