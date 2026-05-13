import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import {
  createLostFoundItemValidator,
  getLostFoundItemDetailsValidator,
  getLostFoundItemsQueryValidator,
  editLostFoundItemValidator,
  deleteLostFoundItemValidator,
} from '../../src/validators/lostAndFound.validator.js';

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

const getErrorWithQuery = async (schemaArray, query) => {
  const req = { body: {}, params: {}, query };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

describe('createLostFoundItemValidator', () => {
  const valid = { type: 'Lost', title: 'Blue Water Bottle', description: 'Lost in library', location: 'Library', date: '2026-05-01', timeOfDay: '14:30' };

  it('accepts valid lost item', async () => {
    assert.equal(await getError(createLostFoundItemValidator, valid), null);
  });

  it('accepts found item', async () => {
    assert.equal(await getError(createLostFoundItemValidator, { ...valid, type: 'Found' }), null);
  });

  it('rejects invalid type', async () => {
    assert.match(await getError(createLostFoundItemValidator, { ...valid, type: 'Stolen' }), /type/i);
  });

  it('rejects missing title', async () => {
    assert.match(await getError(createLostFoundItemValidator, { ...valid, title: '' }), /title/i);
  });

  it('rejects missing description', async () => {
    assert.match(await getError(createLostFoundItemValidator, { ...valid, description: '' }), /description/i);
  });

  it('rejects missing location', async () => {
    assert.match(await getError(createLostFoundItemValidator, { ...valid, location: '' }), /location/i);
  });

  it('rejects invalid date', async () => {
    assert.match(await getError(createLostFoundItemValidator, { ...valid, date: 'bad-date' }), /date/i);
  });

  it('rejects invalid time format', async () => {
    assert.match(await getError(createLostFoundItemValidator, { ...valid, timeOfDay: '25:00' }), /time|HH:mm/i);
  });
});

describe('getLostFoundItemDetailsValidator', () => {
  it('accepts valid integer param', async () => {
    assert.equal(await getErrorWithParams(getLostFoundItemDetailsValidator, { id: '5' }), null);
  });
  it('rejects non-integer', async () => {
    assert.ok(await getErrorWithParams(getLostFoundItemDetailsValidator, { id: 'abc' }));
  });
});

describe('getLostFoundItemsQueryValidator', () => {
  it('accepts without filter', async () => {
    assert.equal(await getErrorWithQuery(getLostFoundItemsQueryValidator, {}), null);
  });
  it('accepts valid filter', async () => {
    assert.equal(await getErrorWithQuery(getLostFoundItemsQueryValidator, { type: 'Lost' }), null);
  });
  it('accepts All filter', async () => {
    assert.equal(await getErrorWithQuery(getLostFoundItemsQueryValidator, { type: 'All' }), null);
  });
  it('rejects invalid filter', async () => {
    assert.ok(await getErrorWithQuery(getLostFoundItemsQueryValidator, { type: 'Unknown' }));
  });
});

describe('editLostFoundItemValidator', () => {
  it('accepts valid edit', async () => {
    assert.equal(await getErrorWithParams(editLostFoundItemValidator, { id: '3' }, { status: 'Resolved' }), null);
  });
  it('rejects invalid status', async () => {
    assert.ok(await getErrorWithParams(editLostFoundItemValidator, { id: '3' }, { status: 'Deleted' }));
  });
});

describe('deleteLostFoundItemValidator', () => {
  it('accepts valid param', async () => {
    assert.equal(await getErrorWithParams(deleteLostFoundItemValidator, { id: '7' }), null);
  });
});
