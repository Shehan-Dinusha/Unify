import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getError } from "../helpers/testUtils.js";
import { createConversationValidator } from "../../src/validators/chat.validator.js";

describe("createConversationValidator", () => {
  it("accepts valid targetUserId", async () => {
    assert.equal(
      await getError(createConversationValidator, { targetUserId: 42 }),
      null,
    );
  });

  it("rejects missing targetUserId", async () => {
    const err = await getError(createConversationValidator, {});
    assert.match(err, /Valid user ID is required/i);
  });

  it("rejects non-integer targetUserId", async () => {
    const err = await getError(createConversationValidator, {
      targetUserId: "abc",
    });
    assert.match(err, /Valid user ID is required/i);
  });

  it("rejects zero targetUserId", async () => {
    const err = await getError(createConversationValidator, {
      targetUserId: 0,
    });
    assert.match(err, /Valid user ID is required/i);
  });
});
