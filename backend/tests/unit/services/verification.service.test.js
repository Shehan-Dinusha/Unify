import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  VERIFICATION_ROLES,
  formatFileSize,
  detectFileType,
} from '../../../src/services/verification.service.js';

describe('VERIFICATION_ROLES', () => {
  it('contains Club and Batch Rep', () => {
    assert.ok(VERIFICATION_ROLES.includes('Club'));
    assert.ok(VERIFICATION_ROLES.includes('Batch Rep'));
    assert.equal(VERIFICATION_ROLES.length, 2);
  });
});

describe('formatFileSize', () => {
  it('returns "0 Bytes" for null', () => {
    assert.equal(formatFileSize(null), '0 Bytes');
  });

  it('returns "0 Bytes" for undefined', () => {
    assert.equal(formatFileSize(undefined), '0 Bytes');
  });

  it('returns "0 Bytes" for 0', () => {
    assert.equal(formatFileSize(0), '0 Bytes');
  });

  it('converts bytes correctly', () => {
    assert.equal(formatFileSize(500), '500 Bytes');
  });

  it('converts KB correctly', () => {
    assert.equal(formatFileSize(1024), '1 KB');
  });

  it('converts MB correctly', () => {
    assert.equal(formatFileSize(1048576), '1 MB');
  });

  it('converts fractional KB correctly', () => {
    assert.equal(formatFileSize(1536), '1.5 KB');
  });

  it('converts GB correctly', () => {
    assert.equal(formatFileSize(1073741824), '1 GB');
  });
});

describe('detectFileType', () => {
  it('returns "pdf" for PDF mime type', () => {
    assert.equal(detectFileType('application/pdf'), 'pdf');
  });

  it('returns "image" for image mime type', () => {
    assert.equal(detectFileType('image/png'), 'image');
    assert.equal(detectFileType('image/jpeg'), 'image');
  });

  it('returns "doc" for word mime type', () => {
    assert.equal(detectFileType('application/msword'), 'doc');
    assert.equal(detectFileType('application/vnd.openxmlformats-officedocument.wordprocessingml.document'), 'doc');
  });

  it('returns "unknown" for unrecognised mime type', () => {
    assert.equal(detectFileType('text/plain'), 'unknown');
  });

  it('returns "unknown" for null', () => {
    assert.equal(detectFileType(null), 'unknown');
  });

  it('returns "unknown" for empty string', () => {
    assert.equal(detectFileType(''), 'unknown');
  });
});
