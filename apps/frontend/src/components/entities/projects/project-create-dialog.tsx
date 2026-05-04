'use client';

import { useState } from 'react';
import { PlusIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DialogBody,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProjectMutation } from '@/features/projects/api/use-projects';

interface ProjectCreateDialogProps {
  canCreateProject: boolean;
  creationUnavailableMessage: string;
}

export function ProjectCreateDialog({
  canCreateProject,
  creationUnavailableMessage,
}: ProjectCreateDialogProps) {
  const createProjectMutation = useCreateProjectMutation();
  const { isPending: submitting } = createProjectMutation;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const project = await createProjectMutation.mutateAsync({
        name,
        description: description.trim() ? description : undefined,
      });

      setName('');
      setDescription('');
      setOpen(false);
      toast.success('Project created', {
        description: `"${project.name}" is ready for new issues.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create project';

      setError(message);
      toast.error('Project creation failed', {
        description: message,
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" disabled={!canCreateProject}>
          <PlusIcon data-icon="inline-start" />
          Create new project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Add a project shell before you start creating issues inside it.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {!canCreateProject ? (
            <Alert>
              <AlertTitle>Creation is currently unavailable</AlertTitle>
              <AlertDescription>{creationUnavailableMessage}</AlertDescription>
            </Alert>
          ) : null}

          <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="project-name">Name</FieldLabel>
                <Input
                  id="project-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Website redesign"
                  required
                  maxLength={120}
                  disabled={!canCreateProject || submitting}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="project-description">Description</FieldLabel>
                <Textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Short project description"
                  rows={4}
                  disabled={!canCreateProject || submitting}
                />
              </Field>
            </FieldGroup>

            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Could not create project</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={!canCreateProject || submitting}>
                {submitting && <Spinner className="me-2" />}
                {submitting ? 'Creating...' : 'Create project'}
              </Button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
