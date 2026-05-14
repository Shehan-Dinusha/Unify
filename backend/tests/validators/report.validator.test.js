import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import {
  createReportSchema,
  updateReportSchema,
  withdrawReportSchema,
} from '../../src/validators/report.validator.js';

const getError = async (schemaArray, data) => {
  const req = { body: data, params: {} };
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

describe('createReportSchema', () => {
  const valid = {
    reportType: 'post',
    category: 'spam',
    reportedEntityId: '42',
  };

  it('accepts valid report', async () => {
    assert.equal(await getError(createReportSchema, valid), null);
  });

  it('accepts with optional fields', async () => {
    assert.equal(await getError(createReportSchema, {
      ...valid,
      additionalDetails: 'This post is spam',
      evidenceUrl: 'https://example.com/evidence',
    }), null);
  });

  it('rejects invalid reportType', async () => {
    assert.match(await getError(createReportSchema, { ...valid, reportType: 'invalid' }), /report type/i);
  });

  it('rejects invalid category', async () => {
    assert.match(await getError(createReportSchema, { ...valid, category: 'invalid' }), /category/i);
  });

  it('rejects missing reportedEntityId', async () => {
    assert.match(await getError(createReportSchema, { reportType: 'post', category: 'spam' }), /id/i);
  });

  it('rejects invalid evidenceUrl', async () => {
    assert.match(await getError(createReportSchema, { ...valid, evidenceUrl: 'not-a-url' }), /URL|link/i);
  });
});

describe('updateReportSchema', () => {
  it('accepts valid status update', async () => {
    assert.equal(await getErrorWithParams(updateReportSchema, { id: '1' }, { status: 'Resolved' }), null);
  });

  it('accepts valid action update', async () => {
    assert.equal(await getErrorWithParams(updateReportSchema, { id: '1' }, { action: 'dismiss', reason: 'No violation found' }), null);
  });

  it('rejects invalid status', async () => {
    assert.ok(await getErrorWithParams(updateReportSchema, { id: '1' }, { status: 'Invalid' }));
  });

  it('rejects dismiss without reason', async () => {
    assert.ok(await getErrorWithParams(updateReportSchema, { id: '1' }, { action: 'dismiss' }));
  });

  it('rejects invalid priority', async () => {
    assert.ok(await getErrorWithParams(updateReportSchema, { id: '1' }, { priority: 'Unknown' }));
  });
});

describe('withdrawReportSchema', () => {
  it('accepts valid withdrawal', async () => {
    assert.equal(await getErrorWithParams(withdrawReportSchema, { id: '3' }, { reason: 'Resolved with the other party' }), null);
  });

  it('rejects short reason', async () => {
    assert.ok(await getErrorWithParams(withdrawReportSchema, { id: '3' }, { reason: 'Ok' }));
  });

  it('rejects missing reason', async () => {
    assert.ok(await getErrorWithParams(withdrawReportSchema, { id: '3' }, {}));
  });
});
