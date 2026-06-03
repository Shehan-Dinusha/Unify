import React from 'react';
import { Clock, FileText, AlertCircle, Eye } from 'lucide-react';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const SubmittedDocumentCard = ({ submittedFile, submissionStatus, onPreview }) => {
  const statusIcon = {
    pending: Clock,
    approved: Clock,
    declined: AlertCircle,
    removed: AlertCircle,
  };
  const Icon = statusIcon[submissionStatus] || Clock;

  const statusColor = {
    pending: 'text-amber-400',
    approved: 'text-green-400',
    declined: 'text-red-400',
    removed: 'text-red-400',
  };

  const statusLabel = {
    pending: 'Review in progress',
    approved: 'Verified',
    removed: 'Removed',
  };

  const accentColors = {
    pending: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', icon: 'text-amber-400' },
    approved: { bg: 'bg-green-500/20', border: 'border-green-500/30', icon: 'text-green-400' },
    declined: { bg: 'bg-red-500/20', border: 'border-red-500/30', icon: 'text-red-400' },
    removed: { bg: 'bg-red-500/20', border: 'border-red-500/30', icon: 'text-red-400' },
  };

  const accent = accentColors[submissionStatus] || accentColors.pending;

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center">
        <span className="text-text-secondary text-xs font-bold">Submitted Document</span>
        <div className="flex items-center gap-1">
          <Icon className={`w-3 h-3 ${statusColor[submissionStatus] || 'text-amber-400'}`} />
          <span className={`text-xs font-bold ${statusColor[submissionStatus] || 'text-amber-400'}`}>
            {statusLabel[submissionStatus] || 'Needs Update'}
          </span>
        </div>
      </div>

      <div className="bg-dark-4 rounded-xl border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
        <div className="p-2 flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-3 overflow-hidden cursor-pointer"
            onClick={() => onPreview(submittedFile)}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${accent.bg} ${accent.border}`}>
              <FileText className={`w-4 h-4 ${accent.icon}`} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={`text-sm font-bold truncate ${submissionStatus === 'declined' || submissionStatus === 'removed' ? 'text-red-400 line-through' : 'text-text-primary'}`}>
                {submittedFile?.name || 'Document unavailable'}
              </span>
              <span className="text-text-secondary text-xs">
                {submittedFile ? formatFileSize(submittedFile.size) : 'File details available upon preview'}
              </span>
            </div>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => onPreview(submittedFile)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors"
              title="View Document"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedDocumentCard;
