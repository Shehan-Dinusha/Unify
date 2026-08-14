import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { User, Conversation } from "../../../../src/modules/index.js";
import { createConversation } from "../../../../src/controllers/chat/createConversation.controller.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("createConversation", () => {
  it("returns 400 when trying to chat with yourself", async () => {
    const req = {
      user: { id: 1, role: "Student" },
      body: { targetUserId: 1 },
    };
    const res = createRes();

    await createConversation(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /yourself/i);
  });

  it("returns 404 when target user is not found", async () => {
    const req = {
      user: { id: 1, role: "Student" },
      body: { targetUserId: 999 },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => null);

    await createConversation(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /not found/i);
  });

  it("returns 400 when Student tries to chat with another Student", async () => {
    const req = {
      user: { id: 1, role: "Student" },
      body: { targetUserId: 2 },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => ({
      id: 2,
      name: "Other Student",
      avatar: null,
      role: "Student",
      isOnline: false,
      lastActive: null,
      status: "Active",
    }));

    await createConversation(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Students and Clubs/i);
  });

  it("returns 400 when Club tries to chat with another Club", async () => {
    const req = {
      user: { id: 1, role: "Club" },
      body: { targetUserId: 2 },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => ({
      id: 2,
      name: "Other Club",
      avatar: null,
      role: "Club",
      isOnline: false,
      lastActive: null,
      status: "Active",
    }));

    await createConversation(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /Students and Clubs/i);
  });

  it("returns 400 when target user is suspended", async () => {
    const req = {
      user: { id: 1, role: "Student" },
      body: { targetUserId: 2 },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => ({
      id: 2,
      name: "Suspended Club",
      avatar: null,
      role: "Club",
      isOnline: false,
      lastActive: null,
      status: "Suspended",
    }));

    await createConversation(req, res);

    assert.equal(res.getStatusCode(), 400);
    assert.match(res.getBody().message, /suspended/i);
  });

  it("returns 201 when a new conversation is created", async () => {
    const req = {
      user: { id: 1, role: "Student" },
      body: { targetUserId: 5 },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => ({
      id: 5,
      name: "Test Club",
      avatar: null,
      role: "Club",
      isOnline: true,
      lastActive: new Date(),
      status: "Active",
    }));

    mock.method(Conversation, "findOrCreate", async () => [
      {
        id: 10,
        participantOneId: 1,
        participantTwoId: 5,
        lastMessageText: null,
        lastMessageAt: new Date(),
        status: "delivered",
        createdAt: new Date(),
      },
      true, // created = true
    ]);

    await createConversation(req, res);

    assert.equal(res.getStatusCode(), 201);
    assert.equal(res.getBody().success, true);
    assert.match(res.getBody().message, /created/i);
    assert.equal(res.getBody().data.isNew, true);
    assert.equal(res.getBody().data.otherUser.id, 5);
  });

  it("returns 200 when conversation already exists", async () => {
    const req = {
      user: { id: 1, role: "Student" },
      body: { targetUserId: 5 },
    };
    const res = createRes();

    mock.method(User, "findByPk", async () => ({
      id: 5,
      name: "Test Club",
      avatar: null,
      role: "Club",
      isOnline: false,
      lastActive: null,
      status: "Active",
    }));

    mock.method(Conversation, "findOrCreate", async () => [
      {
        id: 10,
        participantOneId: 1,
        participantTwoId: 5,
        lastMessageText: "Hello",
        lastMessageAt: new Date(),
        status: "delivered",
        createdAt: new Date(),
      },
      false, // created = false
    ]);

    await createConversation(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.match(res.getBody().message, /already exists/i);
    assert.equal(res.getBody().data.isNew, false);
  });
});
