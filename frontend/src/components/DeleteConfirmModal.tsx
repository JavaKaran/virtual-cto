'use client';

import { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { Project } from '@/types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  project: Project | null;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  project,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !project) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#0a0a0a] rounded-xl border border-neutral-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-white">Delete Project</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2.5 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-white text-[15px] mb-1">
                Delete <strong>{project.name}</strong>?
              </p>
              <p className="text-sm text-neutral-500">
                This action cannot be undone. All data will be permanently removed.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 text-[15px] text-neutral-300 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 h-11 bg-red-600 text-white text-[15px] font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
