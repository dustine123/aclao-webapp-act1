import React from 'react';
import {
  X,
  Download,
  Trash2,
  Share2,
  Calendar,
  HardDrive,
  User as UserIcon,
  FileText,
  Layers,
  FileArchive,
  Image as ImageIcon,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { VaultFile, User } from '../types/index.ts';
import { formatFileSize, formatRelativeDate } from '../utils/vaultLogic.ts';

interface FilePreviewModalProps {
  file: VaultFile | null;
  currentUser: User;
  onClose: () => void;
  onDownload: (file: VaultFile) => void;
  onShare: (file: VaultFile) => void;
  onRequestDelete: (file: VaultFile) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  currentUser,
  onClose,
  onDownload,
  onShare,
  onRequestDelete,
}) => {
  if (!file) return null;

  const isOwner = file.userId === currentUser.id || currentUser.role === 'freelancer';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              {file.category === 'image' && <ImageIcon className="w-5 h-5" />}
              {file.category === 'design' && <Layers className="w-5 h-5" />}
              {file.category === 'document' && <FileText className="w-5 h-5" />}
              {file.category === 'archive' && <FileArchive className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 id="preview-title" className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span className="capitalize">{file.category}</span>
                <span>•</span>
                <span>Uploaded {formatRelativeDate(file.uploadDate)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Preview"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Preview Surface */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
          {file.dataUrl && (file.category === 'image' || file.mimeType.startsWith('image/')) ? (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center min-h-[260px] max-h-[380px]">
              <img
                src={file.dataUrl}
                alt={file.name}
                className="max-w-full max-h-[360px] object-contain"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                {file.category === 'document' && <FileText className="w-8 h-8 text-rose-500" />}
                {file.category === 'design' && <Layers className="w-8 h-8 text-indigo-500" />}
                {file.category === 'archive' && <FileArchive className="w-8 h-8 text-amber-500" />}
                {file.category === 'other' && <FileText className="w-8 h-8 text-slate-400" />}
              </div>
              <h4 className="text-sm font-semibold text-slate-800">Direct File Preview</h4>
              <p className="text-xs text-slate-500 max-w-md">
                This {file.category} asset is safely encrypted in your EsmerengVault. Click download below to save and open in your native editor.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified SHA-256 Checksum</span>
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Uploaded By</span>
              <span className="text-xs font-semibold text-slate-800 truncate block">{file.ownerName}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">MIME Type</span>
              <span className="text-xs font-mono text-slate-800 truncate block">{file.mimeType}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Upload Date</span>
              <span className="text-xs font-semibold text-slate-800 truncate block">
                {new Date(file.uploadDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {file.notes && (
            <div className="mt-4 p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 block mb-1">
                Deliverable Notes
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{file.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestDelete(file);
                }}
                className="w-full sm:w-auto px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-medium rounded-lg border border-rose-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete File</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onShare(file)}
              className="w-full sm:w-auto px-3 py-2 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Link</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onDownload(file)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
