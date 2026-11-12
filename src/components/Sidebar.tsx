import React from 'react';
import {
  ShieldCheck,
  FolderLock,
  HardDrive,
  LogOut,
  Files,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  Building,
  UserCheck,
} from 'lucide-react';
import { User, ClientPortal, FileCategory } from '../types/index.ts';
import { calculateStorageStats } from '../utils/vaultLogic.ts';
import { VaultFile } from '../types/index.ts';

interface SidebarProps {
  currentUser: User;
  portals: ClientPortal[];
  activePortalId: string;
  onSelectPortal: (portalId: string) => void;
  activeCategory: FileCategory;
  onSelectCategory: (cat: FileCategory) => void;
  files: VaultFile[];
  onSignOut: () => void;
  onSwitchUserPrompt: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  portals,
  activePortalId,
  onSelectPortal,
  activeCategory,
  onSelectCategory,
  files,
  onSignOut,
  onSwitchUserPrompt,
  isMobileOpen,
  onCloseMobile,
}) => {
  const stats = calculateStorageStats(files);

  const navItems: { label: string; category: FileCategory; icon: React.ReactNode }[] = [
    { label: 'All Files', category: 'all', icon: <Files className="w-4 h-4" /> },
    { label: 'Design Deliverables', category: 'design', icon: <Layers className="w-4 h-4" /> },
    { label: 'Documents & Contracts', category: 'document', icon: <FolderLock className="w-4 h-4" /> },
    { label: 'Brand & Visual Assets', category: 'image', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Archives & Packages', category: 'archive', icon: <HardDrive className="w-4 h-4" /> },
  ];

  const currentPortal = portals.find((p) => p.id === activePortalId) || portals[0];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Dark Navy Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0B132B] text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">EsmerengVault</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                  Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Secure Client File Exchange</p>
            </div>
          </div>
        </div>

        {/* Portal Workspace Selector */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Client Workspace</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
              {currentUser.role === 'freelancer' ? 'Designer Mode' : 'Client Access'}
            </span>
          </div>

          <div className="relative group">
            <select
              aria-label="Select Client Workspace"
              value={activePortalId}
              onChange={(e) => onSelectPortal(e.target.value)}
              className="w-full appearance-none bg-slate-900/90 text-slate-100 text-xs font-medium rounded-lg px-3 py-2.5 pr-8 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-600 transition-colors cursor-pointer shadow-inner"
            >
              {portals.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none group-hover:text-slate-200 transition-colors" />
          </div>

          {currentPortal && (
            <div className="mt-2 px-2.5 py-1.5 rounded bg-slate-900/50 border border-slate-800/60 flex items-center gap-2 text-xs text-slate-400">
              <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{currentPortal.description}</span>
            </div>
          )}
        </div>

        {/* Navigation Categories */}
        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-1">
          <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            File Vault
          </div>
          {navItems.map((item) => {
            const isActive = activeCategory === item.category;
            return (
              <button
                key={item.category}
                onClick={() => {
                  onSelectCategory(item.category);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.category === 'all' && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {files.length}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Security & Controls
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Isolated Vault Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Files in this portal are restricted to {currentUser.companyName || 'authorized users'}.
            </p>
          </div>
        </div>

        {/* Storage Quota Bar */}
        <div className="p-4 mx-4 mb-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Storage Used
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {stats.formattedTotal} / {stats.formattedQuota}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                stats.percentage > 85 ? 'bg-rose-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.max(stats.percentage, 2)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {stats.count} file{stats.count === 1 ? '' : 's'} safely encrypted
          </p>
        </div>

        {/* User Card & Sign Out */}
        <div className="p-4 border-t border-slate-800 bg-[#080E21]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 ring-2 ring-slate-700">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.companyName}</p>
              </div>
            </div>

            <button
              onClick={onSignOut}
              title="Sign Out of EsmerengVault"
              aria-label="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onSwitchUserPrompt}
            className="w-full mt-2.5 py-1.5 px-2 bg-slate-800/80 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-slate-700/50"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Switch / Test Demo Account</span>
          </button>
        </div>
      </aside>
    </>
  );
};
