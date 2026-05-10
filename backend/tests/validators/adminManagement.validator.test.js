import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import {
  studentDirectoryValidator,
  businessDirectoryValidator,
  updateStatusValidator,
  addNoteValidator,
  sendWarningValidator,
} from '../../src/validators/adminManagement.validator.js';

const getErrorWithQuery = async (schemaArray, query) => {
  const req = { body: {}, params: {}, query };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

const getErrorWithParams = async (schemaArray, params, body) => {
  const req = { body: body || {}, params, query: {} };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

describe('studentDirectoryValidator', () => {
  it('accepts without filters', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, {}), null);
  });
  it('accepts valid filters', async () => {
    assert.equal(await getErrorWithQuery(studentDirectoryValidator, { faculty: 'Engineering', status: 'Active' }), null);
  });
  it('rejects invalid status', async () => {
    assert.ok(await getErrorWithQuery(studentDirectoryValidator, { status: 'Banned' }));
  });
});

describe('businessDirectoryValidator', () => {
  it('accepts without filters', async () => {
    assert.equal(await getErrorWithQuery(businessDirectoryValidator, {}), null);
  });
  it('accepts valid filters', async () => {
    assert.equal(await getErrorWithQuery(businessDirectoryValidator, { category: 'FOOD', status: 'all' }), null);
  });
});

describe('updateStatusValidator', () => {
  const valid = { id: '5', body: { status: 'Suspended' } };
  it('accepts valid status update', async () => {
    assert.equal(await getErrorWithParams(updateStatusValidator, { id: '5' }, { status: 'Active' }), null);
  });
  it('rejects invalid status', async () => {
    assert.ok(await getErrorWithParams(updateStatusValidator, { id: '5' }, { status: 'Unknown' }));
  });
  it('accepts with optional fields', async () => {
    assert.equal(await getErrorWithParams(updateStatusValidator, { id: '5' }, {
      status: 'Suspended',
      reason: 'Violation',
      suspensionCategory: 'Harassment',
      sendEmail: true,
    }), null);
  });
  it('rejects non-integer param', async () => {
    assert.ok(await getErrorWithParams(updateStatusValidator, { id: 'abc' }, { status: 'Active' }));
  });
  it('rejects invalid suspensionCategory', async () => {
    assert.ok(await getErrorWithParams(updateStatusValidator, { id: '5' }, {
      status: 'Suspended',
      suspensionCategory: 'Bad Category',
    }));
  });
});

describe('addNoteValidator', () => {
  it('accepts valid note', async () => {
    assert.equal(await getErrorWithParams(addNoteValidator, { id: '3' }, { text: 'Follow up required' }), null);
  });
  it('rejects empty text', async () => {
    assert.ok(await getErrorWithParams(addNoteValidator, { id: '3' }, { text: '' }));
  });
  it('rejects text over 2000 chars', async () => {
    assert.ok(await getErrorWithParams(addNoteValidator, { id: '3' }, { text: 'x'.repeat(2001) }));
  });
});

describe('sendWarningValidator', () => {
  const valid = {
    message: 'Please follow the guidelines.',
    category: 'Code of Conduct Violation',
    severity: 'Level 1 - Formal Caution',
  };
  it('accepts valid warning', async () => {
    assert.equal(await getErrorWithParams(sendWarningValidator, { id: '7' }, valid), null);
  });
  it('rejects short message', async () => {
    assert.ok(await getErrorWithParams(sendWarningValidator, { id: '7' }, { ...valid, message: 'No' }));
  });
  it('rejects invalid category', async () => {
    assert.ok(await getErrorWithParams(sendWarningValidator, { id: '7' }, { ...valid, category: 'Bad' }));
  });
  it('rejects invalid severity', async () => {
    assert.ok(await getErrorWithParams(sendWarningValidator, { id: '7' }, { ...valid, severity: 'Low' }));
  });
});
