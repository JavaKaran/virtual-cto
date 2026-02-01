'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/types';
import { projectApi } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import ProjectModal from '@/components/ProjectModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  
  // Modal states
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<'create' | 'edit'>('create');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const response = await projectApi.list();
      setProjects(response.projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCreateProject = async (name: string, description: string) => {
    const newProject = await projectApi.create(name, description);
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProject(newProject);
  };

  const handleUpdateProject = async (name: string, description: string) => {
    if (!editingProject) return;
    const updatedProject = await projectApi.update(editingProject.id, { name, description });
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;
    await projectApi.delete(deletingProject.id);
    setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
    if (selectedProject?.id === deletingProject.id) {
      setSelectedProject(null);
    }
  };

  const openCreateModal = () => {
    setProjectModalMode('create');
    setEditingProject(null);
    setProjectModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setProjectModalMode('edit');
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  const openDeleteModal = (project: Project) => {
    setDeletingProject(project);
    setDeleteModalOpen(true);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onNewProject={openCreateModal}
        onDeleteProject={openDeleteModal}
        onEditProject={openEditModal}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 flex flex-col min-h-screen">
        {isLoadingProjects ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          </div>
        ) : (
          <MainContent project={selectedProject} />
        )}
      </main>

      {/* Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={projectModalMode === 'create' ? handleCreateProject : handleUpdateProject}
        project={editingProject}
        mode={projectModalMode}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        project={deletingProject}
      />
    </div>
  );
}
