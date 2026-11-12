export type UserRole = 'freelancer' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName: string;
  avatarUrl?: string;
  createdAt: string;
}

export type FileCategory = 'all' | 'design' | 'document' | 'image' | 'archive' | 'other';

export interface VaultFile {
  id: string;
  userId: string; // The owner/uploader ID
  ownerName: string;
  clientPortalId: string; // Belongs to specific client portal
  name: string;
  size: number; // bytes
  mimeType: string;
  category: Exclude<FileCategory, 'all'>;
  uploadDate: string; // ISO string
  dataUrl?: string; // Base64 or Blob URL for preview and download
  notes?: string;
  downloadCount: number;
}

export interface ClientPortal {
  id: string;
  name: string;
  freelancerId: string;
  clientEmail: string;
  clientName: string;
  description: string;
  color: string;
}
