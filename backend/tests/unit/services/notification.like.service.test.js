/**
 * Like Notification Service — Unit Test Suite
 * ─────────────────────────────────────────────
 * Tests for:
 *   buildLikeTitle · notifyLike (aggregated) · removeLikeFromNotification
 *
 * Run individually:
 *   node --test tests/unit/services/notification.like.service.test.js
 *
 * Mocking strategy:
 *   notifyLike and removeLikeFromNotification interact with the Notification
 *   Sequelize model. We patch its static methods via mock.method so no real
 *   DB connection is required.
 *   buildLikeTitle is a pure function and needs no mocking.
 */

import { describe, it, mock, afterEach } from "node:test";
import assert from "node:assert/strict";

import Notification from "../../../src/modules/Notification.model.js";
import {
  buildLikeTitle,
  notifyLike,
  removeLikeFromNotification,
} from "../../../src/services/notification.service.js";

afterEach(() => {
  mock.restoreAll();
});

// ═══════════════════════════════════════════════════════════════════════════════
// buildLikeTitle
// ═══════════════════════════════════════════════════════════════════════════════

describe("buildLikeTitle", () => {
  it('returns "<Name> liked your post" for a single liker', () => {
    const result = buildLikeTitle([{ id: 1, name: "Alice" }]);
    assert.equal(result, "Alice liked your post");
  });

  it('returns "<A> and <B> liked your post" for two likers', () => {
    const result = buildLikeTitle([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
    assert.equal(result, "Alice and Bob liked your post");
  });

  it('returns "<A>, <B>, and 1 other liked your post" for 3 likers', () => {
    const result = buildLikeTitle([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ]);
    assert.equal(result, "Alice, Bob, and 1 other liked your post");
  });

  it('returns "<A>, <B>, and N others liked your post" for N+2 likers', () => {
    const result = buildLikeTitle([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "C" },
      { id: 4, name: "D" },
    ]);
    assert.equal(result, "Alice, Bob, and 2 others liked your post");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// notifyLike
// ═══════════════════════════════════════════════════════════════════════════════

describe("notifyLike", () => {
  it("returns null and skips DB when postOwnerId === actorId", async () => {
    const findOne = mock.method(Notification, "findOne", async () => null);

    const result = await notifyLike({
      postOwnerId: 5,
      actorId: 5,
      actorName: "Self",
      postId: 10,
      postType: "normal",
    });

    assert.equal(result, null);
    assert.equal(findOne.mock.calls.length, 0);
  });

  it("creates a new notification when no unread like notification exists", async () => {
    mock.method(Notification, "findOne", async () => null);
    const createFn = mock.fn(async (data) => ({ id: 1, ...data }));
    mock.method(Notification, "create", createFn);

    const result = await notifyLike({
      postOwnerId: 10,
      actorId: 1,
      actorName: "Alice",
      postId: 42,
      postType: "normal",
    });

    assert.ok(result);
    assert.equal(createFn.mock.calls.length, 1);
    const created = createFn.mock.calls[0].arguments[0];
    assert.equal(created.referenceType, "PostLike");
    assert.equal(created.referenceId, 42);
    assert.equal(created.title, "Alice liked your post");
    const content = JSON.parse(created.content);
    assert.equal(content.users.length, 1);
    assert.equal(content.users[0].name, "Alice");
  });

  it("appends to an existing unread notification instead of creating a new row", async () => {
    const save = mock.fn(async () => {});
    const existing = {
      content: JSON.stringify({ postType: "normal", users: [{ id: 1, name: "Alice" }] }),
      title: "Alice liked your post",
      actorId: 1,
      save,
    };
    mock.method(Notification, "findOne", async () => existing);
    const createFn = mock.method(Notification, "create", async () => ({}));

    const result = await notifyLike({
      postOwnerId: 10,
      actorId: 2,
      actorName: "Bob",
      postId: 42,
      postType: "normal",
    });

    // Should update existing, not create a new row
    assert.equal(createFn.mock.calls.length, 0);
    assert.equal(save.mock.calls.length, 1);
    assert.equal(existing.title, "Alice and Bob liked your post");
    assert.equal(existing.actorId, 2);
    const data = JSON.parse(existing.content);
    assert.equal(data.users.length, 2);
    assert.equal(result, existing);
  });

  it("does not duplicate an actor who is already in the list", async () => {
    const save = mock.fn(async () => {});
    const existing = {
      content: JSON.stringify({ postType: "normal", users: [{ id: 1, name: "Alice" }] }),
      title: "Alice liked your post",
      actorId: 1,
      save,
    };
    mock.method(Notification, "findOne", async () => existing);
    mock.method(Notification, "create", async () => ({}));

    await notifyLike({
      postOwnerId: 10,
      actorId: 1, // same actor — Alice liking again
      actorName: "Alice",
      postId: 42,
      postType: "normal",
    });

    const data = JSON.parse(existing.content);
    assert.equal(data.users.length, 1); // still just Alice
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// removeLikeFromNotification
// ═══════════════════════════════════════════════════════════════════════════════

describe("removeLikeFromNotification", () => {
  it("returns null silently when no notification is found", async () => {
    mock.method(Notification, "findAll", async () => []);

    const result = await removeLikeFromNotification({
      postOwnerId: 10,
      actorId: 1,
      postId: 42,
    });

    assert.equal(result, null);
  });

  it("destroys the notification when the last liker unlikes", async () => {
    const destroy = mock.fn(async () => {});
    const notification = {
      content: JSON.stringify({ postType: "normal", users: [{ id: 1, name: "Alice" }] }),
      destroy,
    };
    mock.method(Notification, "findAll", async () => [notification]);

    const result = await removeLikeFromNotification({
      postOwnerId: 10,
      actorId: 1,
      postId: 42,
    });

    assert.equal(result, true);
    assert.equal(destroy.mock.calls.length, 1);
  });

  it("shrinks the users list and saves when one of multiple likers unlikes", async () => {
    const save = mock.fn(async () => {});
    const notification = {
      content: JSON.stringify({
        postType: "normal",
        users: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ],
      }),
      title: "Alice and Bob liked your post",
      actorId: 2,
      save,
    };
    mock.method(Notification, "findAll", async () => [notification]);

    const result = await removeLikeFromNotification({
      postOwnerId: 10,
      actorId: 1, // Alice unlikes
      postId: 42,
    });

    assert.equal(result, true);
    assert.equal(save.mock.calls.length, 1);
    assert.equal(notification.title, "Bob liked your post");
    assert.equal(notification.actorId, 2); // last remaining user
    const data = JSON.parse(notification.content);
    assert.equal(data.users.length, 1);
    assert.equal(data.users[0].name, "Bob");
  });
});
