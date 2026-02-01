'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Project } from '@/types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  project?: Project | null;
  mode: 'create' | 'edit';
}

export default function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project,
  mode,
}: ProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project && mode === 'edit') {
      setName(project.name);
      setDescription(project.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [project, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(name.trim(), description.trim());
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] rounded-xl border border-neutral-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-white">
            {mode === 'create' ? 'Create Project' : 'Edit Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[13px] text-neutral-400 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 bg-neutral-900 border border-neutral-800 rounded-lg text-[15px] text-white placeholder-neutral-600 outline-none focus:border-neutral-700 transition-colors"
              placeholder="My Project"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[13px] text-neutral-400 mb-2">
              Description <span className="text-neutral-600">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-[15px] text-white placeholder-neutral-600 outline-none focus:border-neutral-700 transition-colors resize-none"
              placeholder="Describe your project..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 text-[15px] text-neutral-300 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-white text-black text-[15px] font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'create' ? (
                'Create'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
