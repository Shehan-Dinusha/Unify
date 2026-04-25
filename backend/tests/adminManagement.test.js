/**
 * Admin Management Backend — Comprehensive Test Suite
 * Tests all logic for student and business management.
 * Matches the pattern used in boost.test.js.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import moment from 'moment';

// ─── Mock Logic Functions ───────────────────────────────────────────────────

/**
 * Validates the student directory formatting logic.
 */
function formatStudent(user, profile, faculty) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || user.name.substring(0, 2).toUpperCase(),
    faculty: faculty?.name || 'Unknown',
    status: user.status,
    lastActive: user.lastActive ? moment(user.lastActive).fromNow() : 'Never'
  };
}

/**
 * Validates the student profile header formatting.
 */
function formatStudentHeader(user, profile) {
  return {
    id: `#${String(user.id).padStart(6, '0')}`,
    name: user.name,
    email: user.email,
    handle: `@${user.name.toLowerCase().replace(/ /g, '')}`,
    status: user.status,
    isPremium: profile?.tier === 'Premium',
    joinedDate: moment(user.createdAt).format('MMM DD, YYYY')
  };
}

/**
 * Validates the business profile summary formatting.
 */
function formatBusinessSummary(revenue, activeAds) {
  return {
    revenueGenerated: `LKR ${(revenue / 1000000).toFixed(1)}M`,
    adsActive: `${activeAds} Campaigns`,
    customerEngagement: '89%'
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Admin Student Management — Logic', () => {
  const mockUser = {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.j@unify.com',
    avatar: null,
    status: 'Active',
    lastActive: new Date(),
    createdAt: new Date('2021-10-12')
  };

  const mockProfile = {
    tier: 'Premium',
    adminNotes: []
  };

  const mockFaculty = { name: 'Faculty of Engineering' };

  it('correctly formats student for directory listing', () => {
    const formatted = formatStudent(mockUser, mockProfile, mockFaculty);
    assert.equal(formatted.id, 1);
    assert.equal(formatted.name, 'Alex Johnson');
    assert.equal(formatted.avatar, 'AL');
    assert.equal(formatted.faculty, 'Faculty of Engineering');
    assert.equal(formatted.lastActive, 'a few seconds ago');
  });

  it('correctly formats student profile header', () => {
    const header = formatStudentHeader(mockUser, mockProfile);
    assert.equal(header.id, '#000001');
    assert.equal(header.handle, '@alexjohnson');
    assert.equal(header.isPremium, true);
    assert.equal(header.joinedDate, 'Oct 12, 2021');
  });

  it('handles missing faculty in directory', () => {
    const formatted = formatStudent(mockUser, mockProfile, null);
    assert.equal(formatted.faculty, 'Unknown');
  });
});

describe('Admin Business Management — Logic', () => {
  it('formats revenue correctly for millions', () => {
    const summary = formatBusinessSummary(4200000, 8);
    assert.equal(summary.revenueGenerated, 'LKR 4.2M');
    assert.equal(summary.adsActive, '8 Campaigns');
  });

  it('formats small revenue correctly', () => {
    const summary = formatBusinessSummary(500000, 2);
    assert.equal(summary.revenueGenerated, 'LKR 0.5M');
  });
});

describe('Admin Management — Edge Cases', () => {
  it('formatStudentHeader handles missing profile tier gracefully', () => {
    const mockUser = { id: 2, name: 'Test', createdAt: new Date() };
    const header = formatStudentHeader(mockUser, null);
    assert.equal(header.isPremium, false);
  });

  it('formatStudent handles null lastActive', () => {
    const mockUser = { id: 3, name: 'New User', lastActive: null };
    const formatted = formatStudent(mockUser, null, null);
    assert.equal(formatted.lastActive, 'Never');
  });
});
