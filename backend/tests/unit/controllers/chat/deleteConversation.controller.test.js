import { describe, it, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { mockRes } from "../../../helpers/testUtils.js";
import { Conversation } from "../../../../src/modules/index.js";
import { deleteConversation } from "../../../../src/controllers/chat/deleteConversation.controller.js";

afterEach(() => {
  mock.restoreAll();
});

const createRes = mockRes;

describe("deleteConversation", () => {
  it("returns 404 when conversation is not found", async () => {
    const req = {
      user: { id: 1 },
      params: { id: "999" },
    };
    const res = createRes();

    mock.method(Conversation, "findByPk", async () => null);

    await deleteConversation(req, res);

    assert.equal(res.getStatusCode(), 404);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /not found/i);
  });

  it("returns 403 when user is not a participant", async () => {
    const req = {
      user: { id: 99 },
      params: { id: "1" },
    };
    const res = createRes();

    mock.method(Conversation, "findByPk", async () => ({
      id: 1,
      participantOneId: 10,
      participantTwoId: 20,
      deletedByParticipantOne: false,
      deletedByParticipantTwo: false,
      save: mock.fn(async () => {}),
    }));

    await deleteConversation(req, res);

    assert.equal(res.getStatusCode(), 403);
    assert.equal(res.getBody().success, false);
    assert.match(res.getBody().message, /not authorized/i);
  });

  it("soft-deletes for participantOne and sets clearedAt", async () => {
    const conversation = {
      id: 1,
      participantOneId: 5,
      participantTwoId: 10,
      deletedByParticipantOne: false,
      deletedByParticipantTwo: false,
      participantOneClearedAt: null,
      participantTwoClearedAt: null,
      save: mock.fn(async () => {}),
    };

    const req = {
      user: { id: 5 },
      params: { id: "1" },
    };
    const res = createRes();

    mock.method(Conversation, "findByPk", async () => conversation);

    await deleteConversation(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(res.getBody().success, true);
    assert.equal(conversation.deletedByParticipantOne, true);
    assert.ok(conversation.participantOneClearedAt instanceof Date);
    assert.equal(conversation.save.mock.calls.length, 1);
  });

  it("soft-deletes for participantTwo and sets clearedAt", async () => {
    const conversation = {
      id: 1,
      participantOneId: 5,
      participantTwoId: 10,
      deletedByParticipantOne: false,
      deletedByParticipantTwo: false,
      participantOneClearedAt: null,
      participantTwoClearedAt: null,
      save: mock.fn(async () => {}),
    };

    const req = {
      user: { id: 10 },
      params: { id: "1" },
    };
    const res = createRes();

    mock.method(Conversation, "findByPk", async () => conversation);

    await deleteConversation(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(conversation.deletedByParticipantTwo, true);
    assert.ok(conversation.participantTwoClearedAt instanceof Date);
    assert.equal(conversation.save.mock.calls.length, 1);
  });

  it("schedules permanent deletion when both participants have deleted", async () => {
    const conversation = {
      id: 1,
      participantOneId: 5,
      participantTwoId: 10,
      deletedByParticipantOne: true, // Already deleted by participant one
      deletedByParticipantTwo: false,
      participantOneClearedAt: new Date(),
      participantTwoClearedAt: null,
      scheduledDeletionAt: null,
      save: mock.fn(async () => {}),
    };

    const req = {
      user: { id: 10 }, // Participant two deleting now
      params: { id: "1" },
    };
    const res = createRes();

    mock.method(Conversation, "findByPk", async () => conversation);

    await deleteConversation(req, res);

    assert.equal(res.getStatusCode(), 200);
    assert.equal(conversation.deletedByParticipantTwo, true);
    assert.ok(conversation.scheduledDeletionAt instanceof Date);
    // scheduledDeletionAt should be in the future
    assert.ok(conversation.scheduledDeletionAt > new Date());
    assert.equal(conversation.save.mock.calls.length, 1);
  });
});
