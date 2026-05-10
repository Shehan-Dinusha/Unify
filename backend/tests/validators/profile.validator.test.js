import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validationResult } from 'express-validator';
import { clubProfileValidator } from '../../src/validators/profile.validator.js';

const getError = async (schemaArray, data) => {
  const req = { body: data };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(", ");
};

// Note: studentProfileValidator and businessProfileValidator have async custom()
// validators that call Sequelize findByPk() — they require a DB connection and
// cannot be tested without one. Only clubProfileValidator is tested here.

describe('clubProfileValidator', () => {
  const valid = { clubName: 'Chess Club', about: 'We play chess every Friday' };

  it('accepts valid club profile', async () => {
    assert.equal(await getError(clubProfileValidator, valid), null);
  });

  it('accepts with optional email', async () => {
    assert.equal(await getError(clubProfileValidator, { ...valid, email: 'chess@club.com' }), null);
  });

  it('rejects missing clubName', async () => {
    assert.match(await getError(clubProfileValidator, { about: 'Great club' }), /club name/i);
  });

  it('rejects missing about', async () => {
    assert.match(await getError(clubProfileValidator, { clubName: 'Chess Club' }), /about/i);
  });

  it('rejects invalid email format', async () => {
    assert.match(await getError(clubProfileValidator, { ...valid, email: 'not-an-email' }), /email/i);
  });
});
