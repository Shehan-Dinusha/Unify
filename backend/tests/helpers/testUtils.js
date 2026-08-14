/**
 * Shared Test Utilities for Unify Backend
 * ─────────────────────────────────────────
 * DRY helpers used across all validator and controller test files.
 * Uses Node.js built-in test runner (node:test) and assert (node:assert/strict).
 */

import { validationResult } from 'express-validator';

// ─── Validator Test Helpers ──────────────────────────────────────────────────

/**
 * Runs an express-validator schema array against a fake request body
 * and returns null if valid, or a joined error string if invalid.
 */
export const getError = async (schemaArray, data) => {
  const req = { body: data, params: {}, query: {} };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(', ');
};

/**
 * Like getError but also injects route params (e.g. :id).
 */
export const getErrorWithParams = async (schemaArray, params, body = {}) => {
  const req = { body, params, query: {} };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(', ');
};

/**
 * Like getError but validates query string params.
 */
export const getErrorWithQuery = async (schemaArray, query) => {
  const req = { body: {}, params: {}, query };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(', ');
};

/**
 * Full request simulation — body + params + query.
 */
export const getErrorFull = async (schemaArray, { body = {}, params = {}, query = {} } = {}) => {
  const req = { body, params, query };
  for (const validation of schemaArray) {
    await validation.run(req);
  }
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array().map(e => e.msg).join(', ');
};

// ─── Controller Test Helpers ─────────────────────────────────────────────────

/**
 * Creates a mock Express request object.
 * @param {object} overrides — properties to merge onto the req.
 */
export const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  user: null,
  files: null,
  ...overrides,
});

/**
 * Creates a mock Express response object that captures calls to
 * status() and json(). After the controller runs, inspect:
 *   res._status  — the HTTP status code
 *   res._json    — the JSON payload
 */
export const mockRes = () => {
  const res = {
    _status: null,
    _json: null,
    status(code) {
      res._status = code;
      return res;              // chainable: res.status(200).json(...)
    },
    json(data) {
      res._json = data;
      return res;
    },
  };
  return res;
};

/**
 * Creates a mock Express next() that captures the error passed to it.
 * After the controller runs, inspect:
 *   next.called    — boolean
 *   next.error     — the Error instance (if any)
 */
export const mockNext = () => {
  const fn = (err) => {
    fn.called = true;
    fn.error = err || null;
  };
  fn.called = false;
  fn.error = null;
  return fn;
};
