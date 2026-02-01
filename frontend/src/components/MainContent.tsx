'use client';

import { Compass, Calendar, Clock } from 'lucide-react';
import { Project } from '@/types';

interface MainContentProps {
  project: Project | null;
}

export default function MainContent({ project }: MainContentProps) {
  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
          <Compass className="w-8 h-8 text-neutral-500" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Welcome to Virtual CTO
        </h2>
        <p className="text-neutral-500 max-w-sm">
          Select a project from the sidebar or create a new one to get started.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Project Header */}
      <div className="px-8 py-6 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white text-lg font-medium">
            {project.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-white truncate">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-neutral-500 mt-0.5">{project.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                </div>
                <span className="text-[13px] text-neutral-500">Created</span>
              </div>
              <p className="text-white font-medium">
                {formatDate(project.created_at)}
              </p>
            </div>

            <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <Clock className="w-4 h-4 text-neutral-400" />
                </div>
                <span className="text-[13px] text-neutral-500">Last Updated</span>
              </div>
              <p className="text-white font-medium">
                {formatDate(project.updated_at)}
              </p>
              <p className="text-sm text-neutral-600 mt-0.5">{formatTime(project.updated_at)}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
            <h2 className="text-sm font-medium text-white mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-neutral-500">Project ID</label>
                <p className="text-white font-mono text-sm mt-1">{project.id}</p>
              </div>
              <div>
                <label className="text-[13px] text-neutral-500">Description</label>
                <p className="text-white text-sm mt-1">
                  {project.description || 'No description provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
