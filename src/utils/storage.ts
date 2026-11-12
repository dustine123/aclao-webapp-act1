import { User, VaultFile, ClientPortal } from '../types/index.ts';

// Sample SVG placeholder data URLs for immediate crisp visual previews
const SAMPLE_SVG_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none"><rect width="600" height="400" fill="%230F172A"/><circle cx="300" cy="200" r="110" fill="url(%23g1)"/><path d="M260 160L340 200L260 240V160Z" fill="white"/><text x="300" y="350" font-family="system-ui" font-size="22" font-weight="600" fill="%2394A3B8" text-anchor="middle">ACME CORP — MASTER LOGOMARK</text><defs><linearGradient id="g1" x1="190" y1="90" x2="410" y2="310" gradientUnits="userSpaceOnUse"><stop stop-color="%2338BDF8"/><stop offset="1" stop-color="%236366F1"/></linearGradient></defs></svg>`;

const SAMPLE_SVG_HERO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none"><rect width="600" height="400" fill="%231E293B"/><rect x="80" y="70" width="440" height="260" rx="16" fill="%23334155"/><circle cx="160" cy="150" r="36" fill="%23F43F5E"/><rect x="220" y="130" width="240" height="18" rx="6" fill="%23E2E8F0"/><rect x="220" y="160" width="160" height="12" rx="4" fill="%2394A3B8"/><path d="M120 280L210 210L280 260L380 180L480 270" stroke="%2338BDF8" stroke-width="6" stroke-linecap="round"/><text x="300" y="370" font-family="system-ui" font-size="18" font-weight="500" fill="%23CBD5E1" text-anchor="middle">Hero Renders & Marketing Graphics</text></svg>`;

export const INITIAL_USERS: User[] = [
  {
    id: 'user-designer-1',
    name: 'Alex Rivera',
    email: 'alex@riveradesign.co',
    role: 'freelancer',
    companyName: 'Rivera Creative Studio',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'user-client-1',
    name: 'Sarah Chen',
    email: 'sarah@acme.com',
    role: 'client',
    companyName: 'Acme Corporation',
    createdAt: '2026-10-15T10:30:00Z',
  },
  {
    id: 'user-client-2',
    name: 'Marcus Vance',
    email: 'marcus@apex.io',
    role: 'client',
    companyName: 'Apex Media Group',
    createdAt: '2026-10-28T14:15:00Z',
  },
];

export const INITIAL_PORTALS: ClientPortal[] = [
  {
    id: 'portal-acme',
    name: 'Acme Brand Refresh & Portal',
    freelancerId: 'user-designer-1',
    clientEmail: 'sarah@acme.com',
    clientName: 'Sarah Chen',
    description: 'Corporate brand overhaul, design system tokens, and client deliverables.',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'portal-apex',
    name: 'Apex Media SaaS Dashboard UX',
    freelancerId: 'user-designer-1',
    clientEmail: 'marcus@apex.io',
    clientName: 'Marcus Vance',
    description: 'Web application interface design, iconography, and client review assets.',
    color: 'from-emerald-600 to-teal-700',
  },
];

export const INITIAL_FILES: VaultFile[] = [
  {
    id: 'file-1',
    userId: 'user-designer-1',
    ownerName: 'Alex Rivera (Designer)',
    clientPortalId: 'portal-acme',
    name: 'Acme-Brand-Guidelines-v2.4.pdf',
    size: 4404019, // ~4.2 MB
    mimeType: 'application/pdf',
    category: 'document',
    uploadDate: '2026-11-10T14:22:00Z',
    notes: 'Approved final brand guidelines including typography and color system tokens.',
    downloadCount: 7,
  },
  {
    id: 'file-2',
    userId: 'user-client-1',
    ownerName: 'Sarah Chen (Client)',
    clientPortalId: 'portal-acme',
    name: 'Master-Vector-Logomarks.svg',
    size: 348160, // ~340 KB
    mimeType: 'image/svg+xml',
    category: 'image',
    uploadDate: '2026-11-11T09:15:00Z',
    dataUrl: SAMPLE_SVG_LOGO,
    notes: 'Primary full color and monochrome vector marks for dark mode.',
    downloadCount: 14,
  },
  {
    id: 'file-3',
    userId: 'user-designer-1',
    ownerName: 'Alex Rivera (Designer)',
    clientPortalId: 'portal-acme',
    name: 'Design-Tokens-Components.fig',
    size: 29884416, // ~28.5 MB
    mimeType: 'application/octet-stream',
    category: 'design',
    uploadDate: '2026-11-11T16:45:00Z',
    notes: 'Complete Figma design library components with auto-layout v5.',
    downloadCount: 3,
  },
  {
    id: 'file-4',
    userId: 'user-client-1',
    ownerName: 'Sarah Chen (Client)',
    clientPortalId: 'portal-acme',
    name: 'Q4-Deliverables-Signoff-Agreement.pdf',
    size: 870400, // ~850 KB
    mimeType: 'application/pdf',
    category: 'document',
    uploadDate: '2026-11-12T08:30:00Z',
    notes: 'Countersigned acceptance document for Phase 1 deliverables.',
    downloadCount: 2,
  },
  {
    id: 'file-5',
    userId: 'user-client-1',
    ownerName: 'Sarah Chen (Client)',
    clientPortalId: 'portal-acme',
    name: 'Hero-Render-Assets-Export.zip',
    size: 44198912, // ~42.1 MB
    mimeType: 'application/zip',
    category: 'archive',
    uploadDate: '2026-11-12T09:10:00Z',
    notes: 'High-res 4K marketing graphic renders and transparent webp assets.',
    downloadCount: 5,
  },
  {
    id: 'file-6',
    userId: 'user-designer-1',
    ownerName: 'Alex Rivera (Designer)',
    clientPortalId: 'portal-apex',
    name: 'Apex-Dashboard-Prototypes.fig',
    size: 18454937, // ~17.6 MB
    mimeType: 'application/octet-stream',
    category: 'design',
    uploadDate: '2026-11-09T11:20:00Z',
    notes: 'Interactive prototyping screens for analytics dashboard.',
    downloadCount: 8,
  },
  {
    id: 'file-7',
    userId: 'user-client-2',
    ownerName: 'Marcus Vance (Client)',
    clientPortalId: 'portal-apex',
    name: 'Marketing-Landing-Illustration.svg',
    size: 512000,
    mimeType: 'image/svg+xml',
    category: 'image',
    uploadDate: '2026-11-11T18:05:00Z',
    dataUrl: SAMPLE_SVG_HERO,
    notes: 'Vector artwork for hero section banner.',
    downloadCount: 6,
  },
];

const STORAGE_KEYS = {
  USERS: 'cv_vault_users_v2',
  SESSION: 'cv_vault_session_v2',
  FILES: 'cv_vault_files_v2',
  PORTALS: 'cv_vault_portals_v2',
};

// Safe storage wrapper
export const StorageManager = {
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to storage', e);
    }
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (data) return JSON.parse(data);
      // Default to Sarah Chen for smooth immediate interactive experience, or return null if wanted
      const defaultUser = INITIAL_USERS[1]; // Sarah Chen
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return INITIAL_USERS[1];
    }
  },

  setCurrentUser(user: User | null) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (e) {
      console.error('Failed to save session', e);
    }
  },

  getFiles(): VaultFile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FILES);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(INITIAL_FILES));
      return INITIAL_FILES;
    } catch {
      return INITIAL_FILES;
    }
  },

  saveFiles(files: VaultFile[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    } catch (e) {
      console.error('Failed to save files', e);
    }
  },

  getPortals(): ClientPortal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PORTALS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.PORTALS, JSON.stringify(INITIAL_PORTALS));
      return INITIAL_PORTALS;
    } catch {
      return INITIAL_PORTALS;
    }
  },

  savePortals(portals: ClientPortal[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PORTALS, JSON.stringify(portals));
    } catch (e) {
      console.error('Failed to save portals', e);
    }
  },

  // Reset to initial clean state
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(INITIAL_FILES));
    localStorage.setItem(STORAGE_KEYS.PORTALS, JSON.stringify(INITIAL_PORTALS));
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(INITIAL_USERS[1]));
  },
};
