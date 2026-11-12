import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
  Menu,
  ShieldCheck,
  Building,
  UserCheck,
  X,
  ArrowUpDown,
  Palette,
  Check,
} from 'lucide-react';
import { User, ClientPortal, FileCategory } from '../types/index.ts';
import { SortField, SortDirection } from '../utils/vaultLogic.ts';
import { ThemeId, THEMES, ThemeConfig } from '../utils/theme.ts';

interface NavbarProps {
  currentPortal: ClientPortal;
  currentUser: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: FileCategory;
  onSelectCategory: (cat: FileCategory) => void;
  viewMode: 'list' | 'grid';
  onToggleViewMode: (mode: 'list' | 'grid') => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, dir: SortDirection) => void;
  themeId: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  onOpenMobileMenu: () => void;
  onTriggerUpload: () => void;
  onSwitchUserPrompt: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  currentUser,
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  viewMode,
  onToggleViewMode,
  sortField,
  sortDirection,
  onSortChange,
  themeId,
  onThemeChange,
  onOpenMobileMenu,
  onTriggerUpload,
  onSwitchUserPrompt,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES[themeId] || THEMES['slate-ambient'];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-30 transition-all border-b ${currentTheme.navbarClass}`}>
      <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Mobile hamburger + Workspace details */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open Navigation Menu"
            className={`md:hidden p-1.5 rounded-lg transition-colors shrink-0 ${
              currentTheme.isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold truncate tracking-tight">
                {currentPortal.name}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 shrink-0">
                <ShieldCheck className="w-3 h-3" /> Secure Vault
              </span>
            </div>
            <p className={`text-xs hidden sm:block truncate ${currentTheme.textSecondaryClass}`}>
              Client Portal for {currentPortal.clientName} ({currentUser.companyName})
            </p>
          </div>
        </div>

        {/* Right: Search, Theme Picker, View mode toggles, and Quick Upload action */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Live Search */}
          <div className="relative w-32 sm:w-60">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className={`w-full text-xs pl-8 pr-7 py-1.5 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                currentTheme.isDark
                  ? 'bg-slate-900/90 border border-slate-700/80 text-slate-100 placeholder-slate-500'
                  : 'bg-slate-100/90 border border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Theme / Background Color Switcher */}
          <div className="relative" ref={themeMenuRef}>
            <button
              type="button"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              title="Change Background Canvas Theme"
              aria-label="Change Background Theme"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg border text-xs font-medium transition-all ${
                currentTheme.isDark
                  ? 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden md:inline">{currentTheme.name}</span>
              <span className={`w-2 h-2 rounded-full ${currentTheme.colorSwatch}`} />
            </button>

            {isThemeMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border p-2 z-50 animate-in fade-in slide-in-from-top-1 ${
                  currentTheme.isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-100'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="px-2 py-1.5 mb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Background Color Theme
                </div>
                <div className="space-y-1">
                  {(Object.keys(THEMES) as ThemeId[]).map((key) => {
                    const t = THEMES[key];
                    const isSelected = themeId === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onThemeChange(key);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-500/15 text-indigo-600 font-semibold'
                            : currentTheme.isDark
                            ? 'hover:bg-slate-800 text-slate-300'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${t.colorSwatch}`} />
                          <div>
                            <p className="font-medium text-xs leading-none">{t.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t.description}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div
            className={`hidden sm:flex items-center p-0.5 rounded-lg border ${
              currentTheme.isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => onToggleViewMode('list')}
              title="List View"
              aria-label="List View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? currentTheme.isDark
                    ? 'bg-slate-800 text-white shadow-xs font-semibold'
                    : 'bg-white text-indigo-600 shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('grid')}
              title="Grid View"
              aria-label="Grid View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? currentTheme.isDark
                    ? 'bg-slate-800 text-white shadow-xs font-semibold'
                    : 'bg-white text-indigo-600 shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          <button
            onClick={onTriggerUpload}
            className="px-3 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Files</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Category Tabs & Sort filter */}
      <div
        className={`px-4 sm:px-8 py-2.5 border-t flex flex-wrap items-center justify-between gap-2 ${
          currentTheme.isDark ? 'border-slate-800/80 bg-slate-950/20' : 'border-slate-100 bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {(
            [
              { id: 'all', label: 'All Files' },
              { id: 'design', label: 'Design' },
              { id: 'document', label: 'Documents' },
              { id: 'image', label: 'Images' },
              { id: 'archive', label: 'Archives' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap font-medium ${
                activeCategory === tab.id
                  ? currentTheme.isDark
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-900 text-white font-semibold shadow-xs'
                  : currentTheme.isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`hidden sm:inline flex items-center gap-1 text-[11px] font-medium ${
              currentTheme.isDark ? 'text-slate-400' : 'text-slate-400'
            }`}
          >
            <ArrowUpDown className="w-3 h-3" /> Sort by:
          </span>
          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-') as [SortField, SortDirection];
              onSortChange(field, dir);
            }}
            aria-label="Sort Files"
            className={`rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
              currentTheme.isDark
                ? 'bg-slate-900 border border-slate-700 text-slate-200'
                : 'bg-white border border-slate-200 text-slate-700 shadow-2xs'
            }`}
          >
            <option value="date-desc" className={currentTheme.isDark ? 'bg-slate-900' : ''}>Newest First</option>
            <option value="date-asc" className={currentTheme.isDark ? 'bg-slate-900' : ''}>Oldest First</option>
            <option value="name-asc" className={currentTheme.isDark ? 'bg-slate-900' : ''}>Name (A to Z)</option>
            <option value="name-desc" className={currentTheme.isDark ? 'bg-slate-900' : ''}>Name (Z to A)</option>
            <option value="size-desc" className={currentTheme.isDark ? 'bg-slate-900' : ''}>Largest Size</option>
            <option value="size-asc" className={currentTheme.isDark ? 'bg-slate-900' : ''}>Smallest Size</option>
          </select>
        </div>
      </div>
    </header>
  );
};
