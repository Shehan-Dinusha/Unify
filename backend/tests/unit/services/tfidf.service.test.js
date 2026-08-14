import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  tokenize,
  computeTF,
  computeIDF,
  buildVector,
  cosineSimilarity,
  computeTextSimilarities,
} from '../../../src/services/tfidf.service.js';

// ── tokenize ──────────────────────────────────────────────────────────────────

describe('tokenize', () => {
  it('lowercases all tokens', () => {
    const tokens = tokenize('Blue Water Bottle');
    assert.ok(tokens.includes('blue'));
    assert.ok(tokens.includes('water'));
    assert.ok(tokens.includes('bottle'));
  });

  it('removes stop words', () => {
    const tokens = tokenize('I found the item in the library');
    assert.ok(!tokens.includes('found'));   // stop word
    assert.ok(!tokens.includes('item'));    // stop word
    assert.ok(!tokens.includes('the'));     // stop word
    assert.ok(!tokens.includes('in'));      // stop word
    assert.ok(tokens.includes('library')); // kept
  });

  it('drops tokens shorter than 3 characters', () => {
    const tokens = tokenize('ab cd ef library');
    assert.ok(!tokens.includes('ab'));
    assert.ok(!tokens.includes('cd'));
    assert.ok(!tokens.includes('ef'));
    assert.ok(tokens.includes('library'));
  });

  it('replaces non-alphanumeric characters with spaces', () => {
    const tokens = tokenize('lost: wallet! (black)');
    assert.ok(tokens.includes('wallet'));
    assert.ok(tokens.includes('black'));
  });

  it('returns empty array for null input', () => {
    assert.deepEqual(tokenize(null), []);
  });

  it('returns empty array for non-string input', () => {
    assert.deepEqual(tokenize(123), []);
  });

  it('returns empty array for empty string', () => {
    assert.deepEqual(tokenize(''), []);
  });

  it('returns empty array when all tokens are stop words', () => {
    const tokens = tokenize('I found the item');
    assert.deepEqual(tokens, []);
  });

  it('handles multiple spaces gracefully', () => {
    const tokens = tokenize('blue    water    bottle');
    assert.ok(tokens.includes('blue'));
    assert.ok(tokens.includes('water'));
    assert.ok(tokens.includes('bottle'));
  });
});

// ── computeTF ─────────────────────────────────────────────────────────────────

describe('computeTF', () => {
  it('returns empty map for empty token array', () => {
    assert.equal(computeTF([]).size, 0);
  });

  it('computes correct TF for a single token', () => {
    const tf = computeTF(['apple']);
    assert.ok(Math.abs(tf.get('apple') - 1.0) < 0.001);
  });

  it('normalizes by document length', () => {
    const tf = computeTF(['apple', 'apple', 'banana']);
    assert.ok(Math.abs(tf.get('apple') - 2 / 3) < 0.001);
    assert.ok(Math.abs(tf.get('banana') - 1 / 3) < 0.001);
  });

  it('counts all unique terms', () => {
    const tf = computeTF(['cat', 'dog', 'cat', 'bird']);
    assert.equal(tf.size, 3);
  });
});

// ── computeIDF ────────────────────────────────────────────────────────────────

describe('computeIDF', () => {
  it('returns empty map for empty corpus', () => {
    assert.equal(computeIDF([]).size, 0);
  });

  it('gives higher IDF to rare terms', () => {
    const corpus = [
      ['apple', 'banana'],
      ['apple', 'cherry'],
      ['cherry', 'date'],
    ];
    const idf = computeIDF(corpus);
    // 'banana' appears in 1 doc, 'apple' in 2 — banana should have higher IDF
    assert.ok(idf.get('banana') > idf.get('apple'));
  });

  it('assigns positive IDF to terms that appear in every document', () => {
    const corpus = [['apple'], ['apple']];
    const idf = computeIDF(corpus);
    assert.ok(idf.get('apple') > 0);
  });
});

// ── buildVector ───────────────────────────────────────────────────────────────

describe('buildVector', () => {
  it('returns empty vector when TF is empty', () => {
    assert.equal(buildVector(new Map(), new Map([['apple', 1.5]])).size, 0);
  });

  it('returns empty vector when IDF has no matching terms', () => {
    const tf = new Map([['apple', 0.5]]);
    const idf = new Map([['banana', 1.5]]);
    assert.equal(buildVector(tf, idf).size, 0);
  });

  it('multiplies TF and IDF correctly', () => {
    const tf = new Map([['apple', 0.5]]);
    const idf = new Map([['apple', 2.0]]);
    const vector = buildVector(tf, idf);
    assert.ok(Math.abs(vector.get('apple') - 1.0) < 0.001);
  });

  it('drops terms with IDF of 0', () => {
    const tf = new Map([['apple', 0.5]]);
    const idf = new Map([['apple', 0]]);
    assert.equal(buildVector(tf, idf).size, 0);
  });
});

// ── cosineSimilarity ──────────────────────────────────────────────────────────

describe('cosineSimilarity', () => {
  it('returns 1 for identical non-empty vectors', () => {
    const v = new Map([['word', 0.5]]);
    assert.equal(cosineSimilarity(v, v), 1);
  });

  it('returns 0 for completely disjoint vectors', () => {
    const a = new Map([['apple', 1]]);
    const b = new Map([['banana', 1]]);
    assert.equal(cosineSimilarity(a, b), 0);
  });

  it('returns 0 for empty vectors', () => {
    assert.equal(cosineSimilarity(new Map(), new Map()), 0);
  });

  it('returns value between 0 and 1 for partial overlap', () => {
    const a = new Map([['apple', 1], ['banana', 1]]);
    const b = new Map([['apple', 1], ['cherry', 1]]);
    const score = cosineSimilarity(a, b);
    assert.ok(score > 0 && score < 1);
  });

  it('result is always in [0, 1]', () => {
    const a = new Map([['word', 10]]);
    const b = new Map([['word', 10]]);
    const score = cosineSimilarity(a, b);
    assert.ok(score >= 0 && score <= 1);
  });
});

// ── computeTextSimilarities ───────────────────────────────────────────────────

describe('computeTextSimilarities', () => {
  it('returns high score for nearly identical items', () => {
    const query = { title: 'Blue Water Bottle', description: 'Lost in library' };
    const candidates = [
      { id: 1, title: 'Blue Water Bottle', description: 'Found in library' },
    ];
    const [result] = computeTextSimilarities(query, candidates);
    assert.ok(result.textScore > 0.8, `Expected > 0.8, got ${result.textScore}`);
  });

  it('returns low score for unrelated items', () => {
    const query = { title: 'Blue Water Bottle', description: '' };
    const candidates = [
      { id: 1, title: 'Calculator Texas Instruments', description: 'math class engineering' },
    ];
    const [result] = computeTextSimilarities(query, candidates);
    assert.ok(result.textScore < 0.3, `Expected < 0.3, got ${result.textScore}`);
  });

  it('returns 0 when query text is empty', () => {
    const query = { title: '', description: '' };
    const candidates = [{ id: 1, title: 'Some item somewhere', description: '' }];
    const [result] = computeTextSimilarities(query, candidates);
    assert.equal(result.textScore, 0);
  });

  it('returns 0 for candidate with empty text', () => {
    const query = { title: 'Blue Wallet', description: 'leather wallet' };
    const candidates = [{ id: 1, title: '', description: '' }];
    const [result] = computeTextSimilarities(query, candidates);
    assert.equal(result.textScore, 0);
  });

  it('returns results in the same order as candidates', () => {
    const query = { title: 'Laptop charger', description: 'MacBook Pro charger' };
    const candidates = [
      { id: 10, title: 'MacBook Charger', description: 'laptop charger' },
      { id: 20, title: 'Water Bottle',    description: 'blue bottle library' },
    ];
    const results = computeTextSimilarities(query, candidates);
    assert.equal(results.length, 2);
    assert.equal(results[0].id, 10);
    assert.equal(results[1].id, 20);
    assert.ok(
      results[0].textScore > results[1].textScore,
      'Laptop charger should score higher than water bottle'
    );
  });

  it('handles null title and description without throwing', () => {
    const query = { title: null, description: null };
    const candidates = [{ id: 1, title: 'Some item', description: '' }];
    const [result] = computeTextSimilarities(query, candidates);
    assert.equal(result.textScore, 0);
  });
});
