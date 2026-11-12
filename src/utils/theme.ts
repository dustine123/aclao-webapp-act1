export type ThemeId = 'slate-ambient' | 'editorial-warm' | 'obsidian-dark' | 'nordic-ice';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  colorSwatch: string;
  isDark: boolean;
  canvasClass: string;
  navbarClass: string;
  cardClass: string;
  cardSubtleClass: string;
  cardBorderClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  badgeBgClass: string;
  accentClass: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'slate-ambient': {
    id: 'slate-ambient',
    name: 'Executive Slate',
    description: 'Crisp atmospheric slate with soft indigo ambient illumination',
    colorSwatch: 'bg-indigo-500',
    isDark: false,
    canvasClass: 'bg-[#F1F5F9] bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(99,102,241,0.12),rgba(241,245,249,0.95))]',
    navbarClass: 'bg-white/90 backdrop-blur-md border-slate-200/80 text-slate-900',
    cardClass: 'bg-white border-slate-200/90 shadow-xs text-slate-900',
    cardSubtleClass: 'bg-slate-50 border-slate-200',
    cardBorderClass: 'border-slate-200/90',
    textPrimaryClass: 'text-slate-900',
    textSecondaryClass: 'text-slate-500',
    badgeBgClass: 'bg-slate-100 text-slate-700',
    accentClass: 'indigo',
  },
  'editorial-warm': {
    id: 'editorial-warm',
    name: 'Warm Porcelain',
    description: 'Refined warm studio tone with cashmere undertones',
    colorSwatch: 'bg-amber-600',
    isDark: false,
    canvasClass: 'bg-[#F6F5F2] bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(245,158,11,0.08),rgba(246,245,242,0.95))]',
    navbarClass: 'bg-[#FCFCFA]/90 backdrop-blur-md border-stone-200/80 text-stone-900',
    cardClass: 'bg-white border-stone-200/90 shadow-xs text-stone-900',
    cardSubtleClass: 'bg-stone-50 border-stone-200',
    cardBorderClass: 'border-stone-200/90',
    textPrimaryClass: 'text-stone-900',
    textSecondaryClass: 'text-stone-500',
    badgeBgClass: 'bg-stone-100 text-stone-700',
    accentClass: 'amber',
  },
  'obsidian-dark': {
    id: 'obsidian-dark',
    name: 'Obsidian Midnight',
    description: 'Full immersive dark mode with glowing navy surfaces',
    colorSwatch: 'bg-slate-900 ring-1 ring-slate-600',
    isDark: true,
    canvasClass: 'bg-[#070B14] bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(79,70,229,0.18),rgba(7,11,20,1))]',
    navbarClass: 'bg-[#0B1120]/90 backdrop-blur-md border-slate-800 text-slate-100',
    cardClass: 'bg-[#0E1626] border-slate-800/90 shadow-md text-slate-100',
    cardSubtleClass: 'bg-slate-900/80 border-slate-800',
    cardBorderClass: 'border-slate-800',
    textPrimaryClass: 'text-slate-100',
    textSecondaryClass: 'text-slate-400',
    badgeBgClass: 'bg-slate-800 text-slate-300',
    accentClass: 'indigo',
  },
  'nordic-ice': {
    id: 'nordic-ice',
    name: 'Nordic Clean',
    description: 'Airy cyan & crisp frost palette with high-contrast surfaces',
    colorSwatch: 'bg-teal-500',
    isDark: false,
    canvasClass: 'bg-[#EBF3F5] bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(13,148,136,0.10),rgba(235,243,245,0.95))]',
    navbarClass: 'bg-white/90 backdrop-blur-md border-teal-100/80 text-slate-900',
    cardClass: 'bg-white border-slate-200/90 shadow-xs text-slate-900',
    cardSubtleClass: 'bg-teal-50/50 border-teal-100',
    cardBorderClass: 'border-slate-200/90',
    textPrimaryClass: 'text-slate-900',
    textSecondaryClass: 'text-slate-500',
    badgeBgClass: 'bg-slate-100 text-slate-700',
    accentClass: 'teal',
  },
};

const THEME_STORAGE_KEY = 'cv_vault_theme_id';

export function getSavedTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
    if (saved && THEMES[saved]) return saved;
    return 'slate-ambient';
  } catch {
    return 'slate-ambient';
  }
}

export function saveTheme(themeId: ThemeId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}
