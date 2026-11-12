import { VaultFile, FileCategory } from '../types/index.ts';

/**
 * Format raw byte size into human readable string (KB, MB, GB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const normalizedIndex = Math.min(i, units.length - 1);
  const size = bytes / Math.pow(1024, normalizedIndex);
  
  if (normalizedIndex === 0) return `${bytes} B`;
  return `${size.toFixed(size < 10 && normalizedIndex > 0 ? 1 : 0)} ${units[normalizedIndex]}`;
}

/**
 * Categorize a file by its file extension and MIME type
 */
export function getFileCategory(
  fileName: string,
  mimeType: string = ''
): Exclude<FileCategory, 'all'> {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  if (imageExts.includes(ext) || mimeType.startsWith('image/')) {
    return 'image';
  }

  const designExts = ['fig', 'sketch', 'xd', 'ai', 'psd', 'eps', 'indd', 'raw'];
  if (designExts.includes(ext)) {
    return 'design';
  }

  const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'pages', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'key'];
  if (
    docExts.includes(ext) ||
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text') ||
    mimeType.includes('sheet')
  ) {
    return 'document';
  }

  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
  if (archiveExts.includes(ext) || mimeType.includes('zip') || mimeType.includes('compressed')) {
    return 'archive';
  }

  return 'other';
}

/**
 * Format relative date with fallback to date string
 */
export function formatRelativeDate(isoDateString: string, now: Date = new Date()): string {
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return 'Recently';

  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export type SortField = 'date' | 'name' | 'size';
export type SortDirection = 'asc' | 'desc';

/**
 * Filters and sorts files array
 */
export function filterAndSortFiles(
  files: VaultFile[],
  searchQuery: string = '',
  categoryFilter: FileCategory = 'all',
  sortField: SortField = 'date',
  sortDirection: SortDirection = 'desc'
): VaultFile[] {
  const query = searchQuery.trim().toLowerCase();

  return files
    .filter((file) => {
      // Category filter
      if (categoryFilter !== 'all' && file.category !== categoryFilter) {
        return false;
      }

      // Search filter
      if (query) {
        const matchName = file.name.toLowerCase().includes(query);
        const matchNotes = file.notes?.toLowerCase().includes(query);
        const matchOwner = file.ownerName.toLowerCase().includes(query);
        if (!matchName && !matchNotes && !matchOwner) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      } else if (sortField === 'size') {
        comparison = a.size - b.size;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
}

/**
 * Calculates storage used statistics against a quota
 */
export function calculateStorageStats(
  files: VaultFile[],
  quotaBytes: number = 2 * 1024 * 1024 * 1024 // 2 GB default
) {
  const totalBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);
  const percentage = Math.min(100, Math.round((totalBytes / quotaBytes) * 100));

  return {
    totalBytes,
    formattedTotal: formatFileSize(totalBytes),
    quotaBytes,
    formattedQuota: formatFileSize(quotaBytes),
    percentage,
    count: files.length,
  };
}

/**
 * Form validation helper for authentication
 */
export function validateAuthForm(
  isSignUp: boolean,
  data: { name?: string; email?: string; password?: string }
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (isSignUp) {
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
