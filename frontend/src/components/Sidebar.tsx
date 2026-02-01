'use client';

import { useState } from 'react';
import { Plus, FolderOpen, LogOut, Menu, X, Trash2, Edit2, Compass } from 'lucide-react';
import { Project } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
  onDeleteProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  projects,
  selectedProject,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onEditProject,
  isOpen,
  onToggle,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-neutral-800 flex flex-col transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-neutral-400" />
            <span className="text-sm font-medium text-white">Virtual CTO</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-neutral-800 md:hidden transition-colors"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* New Project Button */}
        <div className="p-3">
          <button
            onClick={onNewProject}
            className="w-full flex items-center justify-center gap-2 h-10 text-sm text-white border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="text-[11px] font-medium text-neutral-600 uppercase tracking-wider px-3 py-3">
            Projects
          </div>
          {projects.length === 0 ? (
            <div className="text-sm text-neutral-600 px-3 py-4 text-center">
              No projects yet
            </div>
          ) : (
            <div className="space-y-0.5">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`group relative flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${
                    selectedProject?.id === project.id
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                  }`}
                  onClick={() => onSelectProject(project)}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <FolderOpen className="w-4 h-4 shrink-0 text-neutral-500" />
                  <span className="truncate flex-1">{project.name}</span>
                  
                  {hoveredProject === project.id && (
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(project);
                        }}
                        className="p-1.5 rounded-md hover:bg-neutral-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-neutral-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project);
                        }}
                        className="p-1.5 rounded-md hover:bg-neutral-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-neutral-400" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User section */}
        <div className="p-3 border-t border-neutral-800">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white text-sm font-medium">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-neutral-300 truncate max-w-[120px]">
                {user?.username}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-md hover:bg-neutral-700 text-neutral-500 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-3 left-3 z-30 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 md:hidden"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>
    </>
  );
}
