import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getError, getErrorWithParams } from '../helpers/testUtils.js';
import {
  createNormalPostValidator,
  createClubProductPostValidator,
  createClubEventPostValidator,
  createBoardingPostValidator,
  postParamsValidator,
  commentValidator,
} from '../../src/validators/post.validator.js';

describe('createNormalPostValidator', () => {
  const valid = { description: 'Hello world', postType: 'club' };
  it('accepts valid post', async () => {
    assert.equal(await getError(createNormalPostValidator, valid), null);
  });
  it('accepts with optional phone', async () => {
    assert.equal(await getError(createNormalPostValidator, { ...valid, phone: '123' }), null);
  });
  it('rejects missing description', async () => {
    assert.match(await getError(createNormalPostValidator, { postType: 'club' }), /description/i);
  });
  it('rejects invalid postType', async () => {
    assert.match(await getError(createNormalPostValidator, { description: 'X', postType: 'invalid' }), /post type/i);
  });
});

describe('createClubProductPostValidator', () => {
  const valid = { name: 'T-shirt', description: 'Cool shirt', price: 25, category: 'Merch' };
  it('accepts valid product', async () => {
    assert.equal(await getError(createClubProductPostValidator, valid), null);
  });
  it('rejects missing name', async () => {
    assert.match(await getError(createClubProductPostValidator, { ...valid, name: '' }), /name/i);
  });
  it('rejects non-numeric price', async () => {
    assert.match(await getError(createClubProductPostValidator, { ...valid, price: 'free' }), /number/i);
  });
});

describe('createClubEventPostValidator', () => {
  const valid = { name: 'Hackathon', description: 'Code event', date: '2026-06-15', time: '10:00', location: 'Main Hall' };
  it('accepts valid event', async () => {
    assert.equal(await getError(createClubEventPostValidator, valid), null);
  });
  it('rejects invalid date', async () => {
    assert.match(await getError(createClubEventPostValidator, { ...valid, date: 'not-a-date' }), /date/i);
  });
  it('rejects missing location', async () => {
    assert.match(await getError(createClubEventPostValidator, { ...valid, location: '' }), /location/i);
  });
});

describe('createBoardingPostValidator', () => {
  const valid = { title: 'Room for rent', location: 'Colombo', description: 'Nice room', price: 15000, phone: '0771234567', gender: 'Any' };
  it('accepts valid boarding', async () => {
    assert.equal(await getError(createBoardingPostValidator, valid), null);
  });
  it('accepts with optional coordinates', async () => {
    assert.equal(await getError(createBoardingPostValidator, { ...valid, latitude: 6.9, longitude: 79.9 }), null);
  });
  it('rejects invalid gender', async () => {
    assert.match(await getError(createBoardingPostValidator, { ...valid, gender: 'All' }), /gender/i);
  });
  it('rejects missing title', async () => {
    assert.match(await getError(createBoardingPostValidator, { ...valid, title: '' }), /title/i);
  });
  it('rejects non-numeric price', async () => {
    assert.match(await getError(createBoardingPostValidator, { ...valid, price: 'expensive' }), /number/i);
  });
  it('rejects invalid latitude', async () => {
    assert.match(await getError(createBoardingPostValidator, { ...valid, latitude: 999 }), /lat/i);
  });
});

describe('postParamsValidator', () => {
  it('accepts valid params', async () => {
    assert.equal(await getErrorWithParams(postParamsValidator, { type: 'normal', id: '5' }), null);
  });
  it('rejects invalid type', async () => {
    assert.ok(await getErrorWithParams(postParamsValidator, { type: 'unknown', id: '5' }));
  });
  it('rejects non-integer id', async () => {
    assert.ok(await getErrorWithParams(postParamsValidator, { type: 'normal', id: 'abc' }));
  });
});

describe('commentValidator', () => {
  it('accepts valid comment', async () => {
    assert.equal(await getError(commentValidator, { content: 'Nice post!' }), null);
  });
  it('rejects empty content', async () => {
    assert.match(await getError(commentValidator, { content: '' }), /content/i);
  });
  it('rejects missing content', async () => {
    assert.match(await getError(commentValidator, {}), /content/i);
  });
});
