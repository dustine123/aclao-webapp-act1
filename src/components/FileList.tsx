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
  Calendar,
  HardDrive,
  User as UserIcon,
  MessageSquare,
} from 'lucide-react';
import { VaultFile, User } from '../types/index.ts';
import { formatFileSize, formatRelativeDate } from '../utils/vaultLogic.ts';

interface FileListProps {
  files: VaultFile[];
  currentUser: User;
  onPreview: (file: VaultFile) => void;
  onDownload: (file: VaultFile) => void;
  onShare: (file: VaultFile) => void;
  onRequestDelete: (file: VaultFile) => void;
  onClearFilters?: () => void;
  isDark?: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  currentUser,
  onPreview,
  onDownload,
  onShare,
  onRequestDelete,
  onClearFilters,
  isDark,
}) => {
  const getFileIcon = (category: string) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case 'design':
        return <Layers className="w-5 h-5 text-indigo-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'archive':
        return <FileArchive className="w-5 h-5 text-amber-500" />;
      default:
        return <FileQuestion className="w-5 h-5 text-slate-500" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'image':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'design':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'document':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'archive':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No files found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          No files match your current category filter or search query. Upload a new file or clear your filters to view vault files.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
          >
            Reset Filters & View All
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border shadow-xs overflow-hidden transition-colors ${
        isDark ? 'bg-[#0E1626] border-slate-800' : 'bg-white border-slate-200/90'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Uploaded Vault Files">
          <thead>
            <tr
              className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                isDark ? 'border-slate-800 bg-slate-900/90 text-slate-400' : 'border-slate-200 bg-slate-50/70 text-slate-500'
              }`}
            >
              <th scope="col" className="py-3.5 px-5">File Name & Info</th>
              <th scope="col" className="py-3.5 px-4">Uploaded By</th>
              <th scope="col" className="py-3.5 px-4">Category</th>
              <th scope="col" className="py-3.5 px-4">File Size</th>
              <th scope="col" className="py-3.5 px-4">Upload Date</th>
              <th scope="col" className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
            {files.map((file) => {
              const isOwner = file.userId === currentUser.id || currentUser.role === 'freelancer';

              return (
                <tr
                  key={file.id}
                  className={`transition-colors group ${
                    isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* File Name & Preview icon */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onPreview(file)}
                        title={`Preview ${file.name}`}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors cursor-pointer group-hover:scale-105 ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-indigo-500/50'
                            : 'bg-slate-100/90 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'
                        }`}
                      >
                        {getFileIcon(file.category)}
                      </button>

                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <button
                          onClick={() => onPreview(file)}
                          className={`font-medium text-xs sm:text-sm truncate block transition-colors text-left ${
                            isDark
                              ? 'text-slate-100 hover:text-indigo-400'
                              : 'text-slate-900 hover:text-indigo-600'
                          }`}
                          title={file.name}
                        >
                          {file.name}
                        </button>
                        {file.notes && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                            <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{file.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Uploaded By */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[130px]">{file.ownerName}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full border capitalize ${getCategoryBadge(
                        file.category
                      )}`}
                    >
                      {file.category}
                    </span>
                  </td>

                  {/* Size */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-slate-600">
                    <div className="flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                    <div className="flex items-center gap-1" title={new Date(file.uploadDate).toLocaleString()}>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatRelativeDate(file.uploadDate)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onPreview(file)}
                        title="Preview file"
                        aria-label={`Preview ${file.name}`}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDownload(file)}
                        title="Download file"
                        aria-label={`Download ${file.name}`}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onShare(file)}
                        title="Share secure link"
                        aria-label={`Share ${file.name}`}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {isOwner && (
                        <button
                          onClick={() => onRequestDelete(file)}
                          title="Delete file"
                          aria-label={`Delete ${file.name}`}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
