import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatFileSize,
  getFileCategory,
  formatRelativeDate,
  filterAndSortFiles,
  calculateStorageStats,
  validateAuthForm,
} from './vaultLogic.ts';
import { VaultFile } from '../types/index.ts';

test('formatFileSize formats byte amounts accurately', () => {
  assert.equal(formatFileSize(0), '0 B');
  assert.equal(formatFileSize(512), '512 B');
  assert.equal(formatFileSize(1024), '1.0 KB');
  assert.equal(formatFileSize(1048576 * 2.5), '2.5 MB');
  assert.equal(formatFileSize(1073741824 * 3), '3.0 GB');
});

test('getFileCategory categorizes file extensions and mimes correctly', () => {
  assert.equal(getFileCategory('hero-banner.png'), 'image');
  assert.equal(getFileCategory('app-icon.svg'), 'image');
  assert.equal(getFileCategory('brand-kit.fig'), 'design');
  assert.equal(getFileCategory('style-guide.sketch'), 'design');
  assert.equal(getFileCategory('contract.pdf'), 'document');
  assert.equal(getFileCategory('budget.xlsx'), 'document');
  assert.equal(getFileCategory('assets-v1.zip'), 'archive');
  assert.equal(getFileCategory('unknown.dat'), 'other');
});

test('formatRelativeDate calculates human-friendly timestamps', () => {
  const baseNow = new Date('2026-11-12T12:00:00Z');
  
  // 10 seconds ago
  const dateJustNow = new Date('2026-11-12T11:59:50Z').toISOString();
  assert.equal(formatRelativeDate(dateJustNow, baseNow), 'Just now');

  // 15 mins ago
  const dateMinsAgo = new Date('2026-11-12T11:45:00Z').toISOString();
  assert.equal(formatRelativeDate(dateMinsAgo, baseNow), '15 mins ago');

  // 3 hours ago
  const dateHoursAgo = new Date('2026-11-12T09:00:00Z').toISOString();
  assert.equal(formatRelativeDate(dateHoursAgo, baseNow), '3 hrs ago');

  // Yesterday
  const dateYesterday = new Date('2026-11-11T12:00:00Z').toISOString();
  assert.equal(formatRelativeDate(dateYesterday, baseNow), 'Yesterday');
});

test('filterAndSortFiles filters by search query and category properly', () => {
  const mockFiles: VaultFile[] = [
    {
      id: 'f1',
      userId: 'u1',
      ownerName: 'Sarah Chen',
      clientPortalId: 'p1',
      name: 'Website Mockups Final.fig',
      size: 45000000,
      mimeType: 'application/octet-stream',
      category: 'design',
      uploadDate: '2026-11-10T10:00:00Z',
      downloadCount: 4,
    },
    {
      id: 'f2',
      userId: 'u1',
      ownerName: 'Sarah Chen',
      clientPortalId: 'p1',
      name: 'Logo Master Files.zip',
      size: 12000000,
      mimeType: 'application/zip',
      category: 'archive',
      uploadDate: '2026-11-11T14:00:00Z',
      downloadCount: 1,
    },
    {
      id: 'f3',
      userId: 'u2',
      ownerName: 'Alex Rivera',
      clientPortalId: 'p1',
      name: 'Invoice Nov 2026.pdf',
      size: 240000,
      mimeType: 'application/pdf',
      category: 'document',
      uploadDate: '2026-11-12T08:00:00Z',
      downloadCount: 0,
    },
  ];

  // Filter category
  const designFiles = filterAndSortFiles(mockFiles, '', 'design');
  assert.equal(designFiles.length, 1);
  assert.equal(designFiles[0].id, 'f1');

  // Search query
  const searched = filterAndSortFiles(mockFiles, 'invoice', 'all');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'f3');

  // Sort by size descending
  const sortedBySize = filterAndSortFiles(mockFiles, '', 'all', 'size', 'desc');
  assert.equal(sortedBySize[0].id, 'f1'); // 45 MB
  assert.equal(sortedBySize[2].id, 'f3'); // 240 KB

  // Sort by name ascending
  const sortedByName = filterAndSortFiles(mockFiles, '', 'all', 'name', 'asc');
  assert.equal(sortedByName[0].name, 'Invoice Nov 2026.pdf');
});

test('calculateStorageStats computes percentages and counts correctly', () => {
  const mockFiles: VaultFile[] = [
    {
      id: 'f1',
      userId: 'u1',
      ownerName: 'User',
      clientPortalId: 'p1',
      name: 'test.zip',
      size: 500 * 1024 * 1024, // 500 MB
      mimeType: 'application/zip',
      category: 'archive',
      uploadDate: '2026-11-10T10:00:00Z',
      downloadCount: 0,
    },
  ];

  const stats = calculateStorageStats(mockFiles, 1000 * 1024 * 1024); // 1 GB quota
  assert.equal(stats.count, 1);
  assert.equal(stats.percentage, 50);
});

test('validateAuthForm tests valid and invalid inputs', () => {
  // Invalid email
  const badEmail = validateAuthForm(false, { email: 'invalid-email', password: 'password123' });
  assert.equal(badEmail.isValid, false);
  assert.ok(badEmail.errors.email);

  // Short password
  const shortPass = validateAuthForm(false, { email: 'test@example.com', password: '123' });
  assert.equal(shortPass.isValid, false);
  assert.ok(shortPass.errors.password);

  // Missing name on sign up
  const missingName = validateAuthForm(true, { email: 'test@example.com', password: 'password123' });
  assert.equal(missingName.isValid, false);
  assert.ok(missingName.errors.name);

  // Valid sign in
  const validSignIn = validateAuthForm(false, { email: 'test@example.com', password: 'password123' });
  assert.equal(validSignIn.isValid, true);
  assert.equal(Object.keys(validSignIn.errors).length, 0);
});
