import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  FileArchive,
  Layers,
  FileQuestion,
  Download,
  Trash2,
  Eye,
  Share2,
  HardDrive,
  Calendar,
} from 'lucide-react';
import { VaultFile, User } from '../types/index.ts';
import { formatFileSize, formatRelativeDate } from '../utils/vaultLogic.ts';

interface FileGridProps {
  files: VaultFile[];
  currentUser: User;
  onPreview: (file: VaultFile) => void;
  onDownload: (file: VaultFile) => void;
  onShare: (file: VaultFile) => void;
  onRequestDelete: (file: VaultFile) => void;
  isDark?: boolean;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  currentUser,
  onPreview,
  onDownload,
  onShare,
  onRequestDelete,
  isDark,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => {
        const isOwner = file.userId === currentUser.id || currentUser.role === 'freelancer';

        return (
          <div
            key={file.id}
            className={`group rounded-2xl border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden ${
              isDark
                ? 'bg-[#0E1626] border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            {/* Thumbnail / Header Preview */}
            <div
              onClick={() => onPreview(file)}
              className="relative h-36 bg-slate-100 flex items-center justify-center cursor-pointer overflow-hidden border-b border-slate-100"
            >
              {file.dataUrl && (file.category === 'image' || file.mimeType.startsWith('image/')) ? (
                <img
                  src={file.dataUrl}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                  {file.category === 'design' && <Layers className="w-12 h-12 text-indigo-400" />}
                  {file.category === 'document' && <FileText className="w-12 h-12 text-rose-400" />}
                  {file.category === 'archive' && <FileArchive className="w-12 h-12 text-amber-400" />}
                  {file.category === 'image' && <ImageIcon className="w-12 h-12 text-emerald-400" />}
                  {file.category === 'other' && <FileQuestion className="w-12 h-12 text-slate-400" />}
                </div>
              )}

              {/* Category pill */}
              <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-700 shadow-xs border border-white/50">
                {file.category}
              </span>

              {/* Quick Hover Overlay */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(file);
                  }}
                  className="p-2 rounded-full bg-white text-slate-800 hover:text-indigo-600 shadow-lg transform hover:scale-110 transition-transform"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(file);
                  }}
                  className="p-2 rounded-full bg-white text-slate-800 hover:text-indigo-600 shadow-lg transform hover:scale-110 transition-transform"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4
                  onClick={() => onPreview(file)}
                  className={`font-medium text-xs sm:text-sm truncate transition-colors cursor-pointer ${
                    isDark ? 'text-slate-100 hover:text-indigo-400' : 'text-slate-900 hover:text-indigo-600'
                  }`}
                  title={file.name}
                >
                  {file.name}
                </h4>
                {file.notes && (
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {file.notes}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <HardDrive className="w-3 h-3 text-slate-400" />
                  {formatFileSize(file.size)}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formatRelativeDate(file.uploadDate)}
                </span>
              </div>

              {/* Action buttons footer */}
              <div className="mt-2.5 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onShare(file)}
                    title="Share Link"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDownload(file)}
                    title="Download File"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isOwner && (
                  <button
                    onClick={() => onRequestDelete(file)}
                    title="Delete File"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
