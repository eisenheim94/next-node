'use client';

import { useEffect, useState } from 'react';

import { deleteProject, getMe, getProjects } from '@/lib/api';
import { ProjectCard } from '@/components/entities/projects/project-card';
import { ProjectCreateDialog } from '@/components/entities/projects/project-create-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AuthUser } from '@/types/auth';
import type { Project } from '@/types/project';
import { isElevatedUserRole } from '@/types/user';

export default function ProjectsPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProjects() {
    try {
      const [projectsData, currentUserData] = await Promise.all([
        getProjects(),
        getMe(),
      ]);

      setProjects(projectsData);
      setCurrentUser(currentUserData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  const canManageProjects = currentUser ? isElevatedUserRole(currentUser.role) : false;
  const projectCreationUnavailableMessage = currentUser && !canManageProjects
    ? 'Only admins and managers can create projects.'
    : 'Project creation is temporarily unavailable.';

  async function handleProjectDelete(projectId: string) {
    if (!window.confirm('Delete this project?')) {
      return;
    }

    setDeletingProjectId(projectId);

    try {
      await deleteProject(projectId);
      setProjects((current) => current.filter((project) => project.id !== projectId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setDeletingProjectId(null);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-3xl font-semibold text-foreground">
              Projects
            </h1>
            <p className="text-sm text-muted-foreground">
              Track the active project spaces your team is working inside.
            </p>
          </div>

          <ProjectCreateDialog
            canCreateProject={canManageProjects}
            creationUnavailableMessage={projectCreationUnavailableMessage}
            onCreated={() => {
              setLoading(true);
              void loadProjects();
            }}
          />
        </section>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load projects</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}

        {!loading && projects.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>
                Start by creating your first project from the button above.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              canDelete={canManageProjects}
              isDeleting={deletingProjectId === project.id}
              onDelete={(projectId) => {
                void handleProjectDelete(projectId);
              }}
              project={project}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
