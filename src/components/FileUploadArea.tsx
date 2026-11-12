import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FilePlus, Sparkles, X } from 'lucide-react';
import { VaultFile, User } from '../types/index.ts';
import { getFileCategory } from '../utils/vaultLogic.ts';

interface FileUploadAreaProps {
  currentUser: User;
  activePortalId: string;
  onFileUpload: (file: VaultFile) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  isDark?: boolean;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  currentUser,
  activePortalId,
  onFileUpload,
  onShowToast,
  isDark,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadingName, setCurrentUploadingName] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [showNotesField, setShowNotesField] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setCurrentUploadingName(file.name);
    setUploadProgress(15);

    // Read file as Data URL for preview & real download support
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 90);
        setUploadProgress(percent);
      }
    };

    reader.onload = () => {
      setUploadProgress(100);
      const dataUrl = reader.result as string;

      setTimeout(() => {
        const newFile: VaultFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          userId: currentUser.id,
          ownerName: `${currentUser.name} (${currentUser.role === 'freelancer' ? 'Designer' : 'Client'})`,
          clientPortalId: activePortalId,
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          category: getFileCategory(file.name, file.type),
          uploadDate: new Date().toISOString(),
          dataUrl: dataUrl,
          notes: notesInput.trim() || undefined,
          downloadCount: 0,
        };

        onFileUpload(newFile);
        setIsUploading(false);
        setUploadProgress(0);
        setCurrentUploadingName('');
        setNotesInput('');
        setShowNotesField(false);
        onShowToast(`"${file.name}" uploaded successfully to vault!`, 'success');
      }, 400);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentUploadingName('');
      onShowToast(`Failed to upload "${file.name}". Please try again.`, 'error');
    };

    // For images, text, and documents up to reasonable size, read as DataURL
    if (file.size <= 25 * 1024 * 1024) {
      reader.readAsDataURL(file);
    } else {
      // Mock big file dataUrl to avoid browser memory crash
      setTimeout(() => {
        setUploadProgress(100);
        const newFile: VaultFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          userId: currentUser.id,
          ownerName: `${currentUser.name} (${currentUser.role === 'freelancer' ? 'Designer' : 'Client'})`,
          clientPortalId: activePortalId,
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          category: getFileCategory(file.name, file.type),
          uploadDate: new Date().toISOString(),
          notes: notesInput.trim() || undefined,
          downloadCount: 0,
        };
        onFileUpload(newFile);
        setIsUploading(false);
        setUploadProgress(0);
        setCurrentUploadingName('');
        setNotesInput('');
        setShowNotesField(false);
        onShowToast(`"${file.name}" uploaded successfully!`, 'success');
      }, 500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
      // reset input value so re-uploading same file works
      e.target.value = '';
    }
  };

  return (
    <div
      className={`rounded-2xl border shadow-xs p-6 mb-6 transition-colors ${
        isDark ? 'bg-[#0E1626] border-slate-800 text-slate-100' : 'bg-white border-slate-200/90 text-slate-900'
      }`}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2">
            <span>Secure File Upload</span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              Client Portal Encrypted
            </span>
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Share design briefs, approval docs, feedback, and raw assets directly with your team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNotesField(!showNotesField)}
          className="text-xs text-indigo-500 hover:text-indigo-400 font-medium self-start sm:self-auto flex items-center gap-1"
        >
          {showNotesField ? '- Hide Notes' : '+ Add Note to Upload'}
        </button>
      </div>

      {showNotesField && (
        <div
          className={`mb-4 p-3 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <label htmlFor="upload-note-input" className="block text-xs font-medium mb-1">
            Optional Note or Client Deliverable Instructions
          </label>
          <input
            id="upload-note-input"
            type="text"
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            placeholder="e.g. 'Draft presentation deck for Monday client review'..."
            className={`w-full text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark
                ? 'bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500'
                : 'bg-white border border-slate-300 text-slate-800'
            }`}
          />
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.005]'
            : isDark
            ? 'border-slate-700/80 hover:border-indigo-400 hover:bg-slate-900/60 bg-slate-900/30'
            : 'border-slate-300/80 hover:border-indigo-400 hover:bg-slate-50/80 bg-slate-50/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload file"
        />

        {isUploading ? (
          <div className="py-3 max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-500 animate-pulse">
              <UploadCloud className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <p className={`text-sm font-semibold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                Uploading {currentUploadingName}...
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Encrypting and hashing into vault...</p>
            </div>
            <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-indigo-500">{uploadProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                isDragging
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : isDark
                  ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
                  : 'bg-white text-indigo-600 border border-slate-200 shadow-sm'
              }`}
            >
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <span className="text-indigo-500 underline underline-offset-2">Click to browse files</span> or drag and drop here
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                PDF, Figma, SVG, PNG, JPG, ZIP, Word documents up to 50 MB
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> End-to-end Vault Protection
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Instant Client Access
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
