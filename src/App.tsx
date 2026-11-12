import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { FileUploadArea } from './components/FileUploadArea.tsx';
import { FileList } from './components/FileList.tsx';
import { FileGrid } from './components/FileGrid.tsx';
import { FilePreviewModal } from './components/FilePreviewModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';
import { User, VaultFile, ClientPortal, FileCategory } from './types/index.ts';
import { StorageManager } from './utils/storage.ts';
import { filterAndSortFiles, SortField, SortDirection } from './utils/vaultLogic.ts';
import { ThemeId, THEMES, getSavedTheme, saveTheme } from './utils/theme.ts';
import { testConnection } from './utils/firebase.ts';
import { ShieldCheck, HardDrive, Files, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageManager.getCurrentUser());
  const [themeId, setThemeId] = useState<ThemeId>(() => getSavedTheme());
  const [portals, setPortals] = useState<ClientPortal[]>(() => StorageManager.getPortals());
  const [activePortalId, setActivePortalId] = useState<string>(() => {
    const savedPortals = StorageManager.getPortals();
    return savedPortals[0]?.id || 'portal-acme';
  });

  const [files, setFiles] = useState<VaultFile[]>(() => StorageManager.getFiles());
  const [activeCategory, setActiveCategory] = useState<FileCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Modals
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<VaultFile | null>(null);
  const [fileToShare, setFileToShare] = useState<VaultFile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const uploadAreaRef = useRef<HTMLDivElement>(null);

  // Save changes to localStorage whenever files change
  useEffect(() => {
    StorageManager.saveFiles(files);
  }, [files]);

  // Test Firestore connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth actions
  const handleSignIn = (user: User) => {
    StorageManager.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    StorageManager.setCurrentUser(null);
    setCurrentUser(null);
    showToast('Signed out successfully.', 'info');
  };

  const handleThemeChange = (newTheme: ThemeId) => {
    setThemeId(newTheme);
    saveTheme(newTheme);
    const themeName = THEMES[newTheme]?.name || newTheme;
    showToast(`Switched canvas to ${themeName}`, 'info');
  };

  // Filter files by active portal and user permissions
  const portalFiles = files.filter((file) => {
    // If freelancer, they can view files for the selected portal
    if (currentUser?.role === 'freelancer') {
      return file.clientPortalId === activePortalId;
    }
    // If client, show files in their portal
    return file.clientPortalId === activePortalId;
  });

  // Filter & sort files
  const displayedFiles = filterAndSortFiles(
    portalFiles,
    searchQuery,
    activeCategory,
    sortField,
    sortDirection
  );

  const handleFileUpload = (newFile: VaultFile) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleDownload = (file: VaultFile) => {
    try {
      if (file.dataUrl) {
        const link = document.createElement('a');
        link.href = file.dataUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Create mock text/blob content for downloadable placeholder
        const content = `=== EsmerengVault Secure File ===\nFile: ${file.name}\nSize: ${file.size} bytes\nCategory: ${file.category}\nUploader: ${file.ownerName}\nUpload Date: ${file.uploadDate}\nNotes: ${file.notes || 'None'}\n\nEsmerengVault End-to-End Vault Encryption Verified.`;
        const blob = new Blob([content], { type: file.mimeType || 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // Update download count
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f))
      );
      showToast(`Downloading "${file.name}"...`, 'success');
    } catch {
      showToast(`Failed to initiate download for ${file.name}.`, 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (!fileToDelete) return;
    const deletedName = fileToDelete.name;
    setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
    if (previewFile?.id === fileToDelete.id) {
      setPreviewFile(null);
    }
    setFileToDelete(null);
    showToast(`Deleted "${deletedName}" from vault.`, 'info');
  };

  const handleSortChange = (field: SortField, dir: SortDirection) => {
    setSortField(field);
    setSortDirection(dir);
  };

  const handleScrollToUpload = () => {
    uploadAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // If not logged in, show dedicated Auth Screen
  if (!currentUser) {
    return (
      <>
        <AuthScreen onSignIn={handleSignIn} onShowToast={showToast} />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  const currentPortal = portals.find((p) => p.id === activePortalId) || portals[0];
  const currentTheme = THEMES[themeId] || THEMES['slate-ambient'];

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row antialiased font-sans selection:bg-indigo-500/20 ${
        currentTheme.isDark ? 'text-slate-100 bg-[#070B14]' : 'text-slate-900 bg-[#F1F5F9]'
      }`}
    >
      {/* 1. Dark Navy Sidebar (per design requirements) */}
      <Sidebar
        currentUser={currentUser}
        portals={portals}
        activePortalId={activePortalId}
        onSelectPortal={setActivePortalId}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        files={portalFiles}
        onSignOut={handleSignOut}
        onSwitchUserPrompt={() => setCurrentUser(null)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area with Adaptive Canvas Background */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-colors duration-300 ${currentTheme.canvasClass}`}>
        {/* Main Navbar */}
        <Navbar
          currentPortal={currentPortal}
          currentUser={currentUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          themeId={themeId}
          onThemeChange={handleThemeChange}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onTriggerUpload={handleScrollToUpload}
          onSwitchUserPrompt={() => setCurrentUser(null)}
        />

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Welcome Banner / Overview */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
              currentTheme.isDark
                ? 'bg-[#0E1626] border-slate-800 text-slate-100 shadow-md'
                : 'bg-white/95 backdrop-blur-xs border-slate-200/90 shadow-xs text-slate-900'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                  {currentUser.role === 'freelancer' ? 'Freelancer Dashboard' : 'Client File Vault'}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-500 font-medium">Encrypted & Online</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">
                Welcome back, {currentUser.name}
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${currentTheme.textSecondaryClass}`}>
                Manage project deliverables, download production files, or upload revisions for{' '}
                <span className="font-semibold">{currentPortal.name}</span>.
              </p>
            </div>

            {/* Quick Stats Chips */}
            <div className="flex items-center gap-3 shrink-0">
              <div
                className={`px-3.5 py-2 rounded-xl border text-center transition-colors ${
                  currentTheme.isDark
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-[11px] font-medium text-slate-400 block">Total Files</span>
                <span className={`text-sm font-bold ${currentTheme.textPrimaryClass}`}>{portalFiles.length}</span>
              </div>
              <div
                className={`px-3.5 py-2 rounded-xl border text-center transition-colors ${
                  currentTheme.isDark
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-[11px] font-medium text-slate-400 block">Active Portal</span>
                <span className="text-xs font-bold text-indigo-500 truncate max-w-[120px] block">
                  {currentPortal.clientName}
                </span>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div ref={uploadAreaRef}>
            <FileUploadArea
              currentUser={currentUser}
              activePortalId={activePortalId}
              onFileUpload={handleFileUpload}
              onShowToast={showToast}
              isDark={currentTheme.isDark}
            />
          </div>

          {/* Vault Files Section */}
          <section aria-labelledby="files-section-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 id="files-section-heading" className="text-base font-semibold flex items-center gap-2">
                  <span>Portal Files</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      currentTheme.isDark
                        ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {displayedFiles.length} item{displayedFiles.length === 1 ? '' : 's'}
                  </span>
                </h3>
                <p className={`text-xs mt-0.5 ${currentTheme.textSecondaryClass}`}>
                  Showing {activeCategory === 'all' ? 'all' : activeCategory} assets in this workspace
                </p>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-indigo-500 hover:text-indigo-400 font-medium"
                >
                  Clear search ({searchQuery})
                </button>
              )}
            </div>

            {/* Render List View or Grid View */}
            {viewMode === 'list' ? (
              <FileList
                files={displayedFiles}
                currentUser={currentUser}
                onPreview={setPreviewFile}
                onDownload={handleDownload}
                onShare={setFileToShare}
                onRequestDelete={setFileToDelete}
                onClearFilters={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                isDark={currentTheme.isDark}
              />
            ) : (
              <FileGrid
                files={displayedFiles}
                currentUser={currentUser}
                onPreview={setPreviewFile}
                onDownload={handleDownload}
                onShare={setFileToShare}
                onRequestDelete={setFileToDelete}
                isDark={currentTheme.isDark}
              />
            )}
          </section>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <FilePreviewModal
        file={previewFile}
        currentUser={currentUser}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
        onShare={setFileToShare}
        onRequestDelete={(file) => {
          setPreviewFile(null);
          setFileToDelete(file);
        }}
      />

      <DeleteConfirmModal
        file={fileToDelete}
        isOpen={Boolean(fileToDelete)}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setFileToDelete(null)}
      />

      <ShareModal
        file={fileToShare}
        isOpen={Boolean(fileToShare)}
        onClose={() => setFileToShare(null)}
        onShowToast={showToast}
      />

      {/* Global Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
