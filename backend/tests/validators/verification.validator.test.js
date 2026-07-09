import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import {
  submitVerificationRequestValidator,
  approveVerificationRequestValidator,
  rejectVerificationRequestValidator,
  revokeBatchRepStatusValidator,
  getVerificationDocumentValidator,
  removeVerifiedAccountValidator,
} from '../../src/validators/verification.validator.js';

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

describe('submitVerificationRequestValidator', () => {
  it('accepts with valid requestedRole', async () => {
    assert.equal(await getError(submitVerificationRequestValidator, { requestedRole: 'Club' }), null);
  });

  it('accepts without requestedRole', async () => {
    assert.equal(await getError(submitVerificationRequestValidator, {}), null);
  });
});

describe('approveVerificationRequestValidator', () => {
  it('accepts valid integer param', async () => {
    assert.equal(await getErrorWithParams(approveVerificationRequestValidator, { id: '5' }), null);
  });

  it('rejects non-integer param', async () => {
    assert.ok(await getErrorWithParams(approveVerificationRequestValidator, { id: 'abc' }));
  });

  it('rejects missing param', async () => {
    assert.ok(await getErrorWithParams(approveVerificationRequestValidator, {}));
  });
});

describe('rejectVerificationRequestValidator', () => {
  it('accepts valid data', async () => {
    assert.equal(await getErrorWithParams(rejectVerificationRequestValidator, { id: '3' }, { reason: 'Insufficient documents' }), null);
  });

  it('rejects missing reason', async () => {
    assert.ok(await getErrorWithParams(rejectVerificationRequestValidator, { id: '3' }, {}));
  });

  it('rejects non-integer param', async () => {
    assert.ok(await getErrorWithParams(rejectVerificationRequestValidator, { id: 'x' }, { reason: 'Bad' }));
  });
});

describe('revokeBatchRepStatusValidator', () => {
  it('accepts valid password', async () => {
    assert.equal(await getError(revokeBatchRepStatusValidator, { password: 'secret123' }), null);
  });

  it('rejects missing password', async () => {
    assert.ok(await getError(revokeBatchRepStatusValidator, {}));
  });
});

describe('getVerificationDocumentValidator', () => {
  it('accepts valid param', async () => {
    assert.equal(await getErrorWithParams(getVerificationDocumentValidator, { id: '7' }), null);
  });
});

describe('removeVerifiedAccountValidator', () => {
  it('accepts valid param', async () => {
    assert.equal(await getErrorWithParams(removeVerifiedAccountValidator, { id: '2' }), null);
  });
});
