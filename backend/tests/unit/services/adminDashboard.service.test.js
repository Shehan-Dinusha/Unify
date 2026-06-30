import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import moment from 'moment';
import {
  formatStudentForDirectory,
  isStatusChangeRedundant,
  canForceLogout,
  canSendWarning,
} from '../../../src/services/adminDashboard.service.js';

describe('formatStudentForDirectory', () => {
  it('formats a student with all fields', () => {
    const user = { id: 1, name: 'Alex Johnson', status: 'Active', lastActive: new Date() };
    const faculty = { name: 'Faculty of Engineering' };
    const formatted = formatStudentForDirectory(user, faculty);

    assert.equal(formatted.id, 1);
    assert.equal(formatted.name, 'Alex Johnson');
    assert.equal(formatted.status, 'Active');
    assert.equal(formatted.faculty, 'Faculty of Engineering');
    assert.equal(formatted.lastActive, 'a few seconds ago');
  });

  it('handles null faculty', () => {
    const user = { id: 2, name: 'New User', status: 'Active', lastActive: null };
    const formatted = formatStudentForDirectory(user, null);

    assert.equal(formatted.faculty, 'Unknown');
    assert.equal(formatted.lastActive, 'Never');
  });

  it('handles faculty with no name', () => {
    const user = { id: 3, name: 'Jane', status: 'Suspended', lastActive: new Date() };
    const formatted = formatStudentForDirectory(user, {});

    assert.equal(formatted.faculty, 'Unknown');
  });
});

describe('isStatusChangeRedundant', () => {
  it('returns true when status is unchanged', () => {
    assert.equal(isStatusChangeRedundant('Suspended', 'Suspended'), true);
  });

  it('returns false when status changes', () => {
    assert.equal(isStatusChangeRedundant('Active', 'Suspended'), false);
  });

  it('returns false when both are different', () => {
    assert.equal(isStatusChangeRedundant('Active', 'Inactive'), false);
  });
});

describe('canForceLogout', () => {
  it('returns true when user is online', () => {
    assert.equal(canForceLogout(true), true);
  });

  it('returns false when user is offline', () => {
    assert.equal(canForceLogout(false), false);
  });
});

describe('canSendWarning', () => {
  it('returns true for active students', () => {
    assert.equal(canSendWarning('Active'), true);
  });

  it('returns false for suspended students', () => {
    assert.equal(canSendWarning('Suspended'), false);
  });

  it('returns true for other statuses', () => {
    assert.equal(canSendWarning('Inactive'), true);
  });
});
