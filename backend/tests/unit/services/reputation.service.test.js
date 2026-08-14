import { describe, it, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { updateStudentReputation } from '../../../src/services/reputation.service.js';
import { StudentProfile, User, AdminLog } from '../../../src/modules/index.js';

afterEach(() => {
  mock.restoreAll();
});

const makeProfile = (overrides = {}) => ({
  reputationScore: 100,
  async save() {},
  ...overrides,
});

describe('updateStudentReputation', () => {
  it('does nothing if no student profile exists', async () => {
    mock.method(StudentProfile, 'findOne', async () => null);

    const result = await updateStudentReputation(5, 'FOUND_ITEM_RETURNED');

    assert.equal(result, undefined);
  });

  it('does nothing for an unknown action type', async () => {
    const save = mock.fn(async () => {});
    mock.method(StudentProfile, 'findOne', async () => makeProfile({ save }));

    const result = await updateStudentReputation(5, 'MYSTERY_ACTION');

    assert.equal(result, undefined);
    assert.equal(save.mock.calls.length, 0);
  });

  it('adds points for a positive action', async () => {
    const save = mock.fn(async function () {});
    const profile = makeProfile({ save });
    mock.method(StudentProfile, 'findOne', async () => profile);

    const result = await updateStudentReputation(5, 'FOUND_ITEM_RETURNED');

    assert.equal(profile.reputationScore, 150);
    assert.equal(result, 150);
    assert.equal(save.mock.calls.length, 1);
  });

  it('subtracts points for a violation', async () => {
    const profile = makeProfile();
    mock.method(StudentProfile, 'findOne', async () => profile);

    const result = await updateStudentReputation(5, 'VIOLATION_DELETED');

    assert.equal(profile.reputationScore, 50);
    assert.equal(result, 50);
  });

  it('clamps the score so it never drops below zero', async () => {
    const profile = makeProfile({ reputationScore: 20 });
    mock.method(StudentProfile, 'findOne', async () => profile);

    const result = await updateStudentReputation(5, 'WARNING_RECEIVED');

    assert.equal(profile.reputationScore, 0);
    assert.equal(result, 0);
  });

  it('auto-suspends the user when reputation reaches zero', async () => {
    const user = { id: 5, status: 'Active', async save() {} };
    const adminLog = mock.fn(async () => {});
    const profile = makeProfile({ reputationScore: 20 });
    mock.method(StudentProfile, 'findOne', async () => profile);
    mock.method(User, 'findByPk', async () => user);
    mock.method(AdminLog, 'create', adminLog);

    await updateStudentReputation(5, 'WARNING_RECEIVED');

    assert.equal(user.status, 'Suspended');
    assert.equal(adminLog.mock.calls.length, 1);
    assert.equal(adminLog.mock.calls[0].arguments[0].type, 'user_suspended');
    assert.equal(adminLog.mock.calls[0].arguments[0].targetUserId, 5);
  });

  it('does not re-suspend a user that is already suspended', async () => {
    const user = { id: 5, status: 'Suspended', async save() {} };
    const adminLog = mock.fn(async () => {});
    const profile = makeProfile({ reputationScore: 20 });
    mock.method(StudentProfile, 'findOne', async () => profile);
    mock.method(User, 'findByPk', async () => user);
    mock.method(AdminLog, 'create', adminLog);

    await updateStudentReputation(5, 'WARNING_RECEIVED');

    assert.equal(user.status, 'Suspended');
    assert.equal(adminLog.mock.calls.length, 0);
  });

  it('does not auto-suspend when score stays positive', async () => {
    const adminLog = mock.fn(async () => {});
    mock.method(StudentProfile, 'findOne', async () => makeProfile());
    mock.method(AdminLog, 'create', adminLog);

    await updateStudentReputation(5, 'FOUND_ITEM_RETURNED');

    assert.equal(adminLog.mock.calls.length, 0);
  });

  it('returns undefined when a database error occurs', async () => {
    mock.method(StudentProfile, 'findOne', async () => {
      throw new Error('db down');
    });

    const result = await updateStudentReputation(5, 'FOUND_ITEM_RETURNED');

    assert.equal(result, undefined);
  });
});
