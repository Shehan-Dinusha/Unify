import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import {
  updateStatusValidator,
  sendWarningValidator,
} from '../../src/validators/adminManagement.validator.js';

const getError = async (schemaArray, data, params = {}) => {
  const req = { body: data, params, query: {} };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(', ');
};

describe('updateStatusValidator', () => {
  it('accepts valid suspension request', async () => {
    const err = await getError(updateStatusValidator, {
      status: 'Suspended',
      reason: 'Policy violation',
      suspensionCategory: 'Violation of Terms',
      sendEmail: true,
    }, { id: '1' });
    assert.equal(err, null);
  });

  it('rejects missing status', async () => {
    const err = await getError(updateStatusValidator, {}, { id: '1' });
    assert.match(err, /Status/);
  });

  it('rejects invalid status', async () => {
    const err = await getError(updateStatusValidator, { status: 'Banned' }, { id: '1' });
    assert.match(err, /Invalid status/);
  });

  it('rejects invalid suspension category', async () => {
    const err = await getError(updateStatusValidator, {
      status: 'Suspended',
      suspensionCategory: 'Bad Behavior',
    }, { id: '1' });
    assert.match(err, /Invalid suspension category/);
  });

  it('accepts valid suspension categories', async () => {
    const valid = ['Violation of Terms', 'Spam Activity', 'Harassment', 'Non-payment'];
    for (const category of valid) {
      const err = await getError(updateStatusValidator, {
        status: 'Suspended',
        suspensionCategory: category,
      }, { id: '1' });
      assert.equal(err, null, `Expected '${category}' to be valid`);
    }
  });
});

describe('sendWarningValidator', () => {
  it('accepts valid warning request', async () => {
    const err = await getError(sendWarningValidator, {
      message: 'This is a formal warning about your behavior.',
      category: 'Code of Conduct Violation',
      severity: 'Level 1 - Formal Caution',
    }, { id: '1' });
    assert.equal(err, null);
  });

  it('rejects invalid violation category', async () => {
    const err = await getError(sendWarningValidator, {
      message: 'This is a warning message.',
      category: 'Bad Behavior',
      severity: 'Level 1 - Formal Caution',
    }, { id: '1' });
    assert.match(err, /Invalid violation category/);
  });

  it('accepts valid violation categories', async () => {
    const valid = [
      'Academic Integrity Violation',
      'Code of Conduct Violation',
      'Harassment or Bullying',
      'Spam or Misuse',
      'Inappropriate Content',
    ];
    for (const category of valid) {
      const err = await getError(sendWarningValidator, {
        message: 'This is a warning message about ' + category,
        category,
        severity: 'Level 1 - Formal Caution',
      }, { id: '1' });
      assert.equal(err, null, `Expected '${category}' to be valid`);
    }
  });

  it('rejects invalid severity level', async () => {
    const err = await getError(sendWarningValidator, {
      message: 'This is a warning message.',
      category: 'Spam or Misuse',
      severity: 'Level 5 - Super Serious',
    }, { id: '1' });
    assert.match(err, /Invalid severity level/);
  });

  it('rejects short warning message', async () => {
    const err = await getError(sendWarningValidator, {
      message: 'Hi',
      category: 'Spam or Misuse',
      severity: 'Level 1 - Formal Caution',
    }, { id: '1' });
    assert.ok(err);
  });
});
