'use client';

import { useEffect, useState } from 'react';

import { PlusIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';

import { useCreateIssueMutation } from '@/features/issues/api/use-issues';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import type { AuthUser } from '@/types/auth';
import type { IssuePriority, IssueStatus } from '@/types/issue';
import type { Project } from '@/types/project';
import type { User } from '@/types/user';

interface IssueCreateDialogProps {
  canCreateIssue: boolean;
  creationUnavailableMessage: string;
  currentUser: AuthUser | null;
  projects: Project[];
  users: User[];
}

export function IssueCreateDialog({
  canCreateIssue,
  creationUnavailableMessage,
  currentUser,
  projects,
  users,
}: IssueCreateDialogProps) {
  const createIssueMutation = useCreateIssueMutation();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('BACKLOG');
  const [priority, setPriority] = useState<IssuePriority>('MEDIUM');
  const [projectId, setProjectId] = useState('');
  const [reporterId, setReporterId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId && projects[0]) {
      setProjectId(projects[0].id);
    }
  }, [projectId, projects]);

  useEffect(() => {
    if (currentUser?.id) {
      setReporterId((current) => current || currentUser.id);
    }
  }, [currentUser]);

  function resetForm() {
    setTitle('');
    setDescription('');
    setStatus('BACKLOG');
    setPriority('MEDIUM');
    setAssigneeId('');
    setError(null);

    if (projects[0]) {
      setProjectId(projects[0].id);
    }

    if (currentUser?.id) {
      setReporterId(currentUser.id);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const issue = await createIssueMutation.mutateAsync({
        title,
        description: description.trim() ? description : undefined,
        status,
        priority,
        projectId,
        reporterId,
        assigneeId: assigneeId || undefined,
      });

      setOpen(false);
      resetForm();

      toast.success('Issue created', {
        description: `"${issue.title}" was added to ${issue.project.name}.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create issue';

      setError(message);
      toast.error('Issue creation failed', {
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
        <Button type="button" disabled={!canCreateIssue}>
          <PlusIcon data-icon="inline-start" />
          Create new issue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new issue</DialogTitle>
          <DialogDescription>
            Connect new work to a project, reporter, and optional assignee.
          </DialogDescription>
        </DialogHeader>

        {!canCreateIssue ? (
          <Alert>
            <AlertTitle>Creation is currently unavailable</AlertTitle>
            <AlertDescription>{creationUnavailableMessage}</AlertDescription>
          </Alert>
        ) : null}

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="issue-title">Title</FieldLabel>
              <Input
                id="issue-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Fix broken dashboard filter"
                required
                maxLength={160}
                disabled={!canCreateIssue || createIssueMutation.isPending}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="issue-description">Description</FieldLabel>
              <Textarea
                id="issue-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                disabled={!canCreateIssue || createIssueMutation.isPending}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value as IssueStatus);
                  }}
                  disabled={!canCreateIssue || createIssueMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="BACKLOG">BACKLOG</SelectItem>
                      <SelectItem value="TODO">TODO</SelectItem>
                      <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                      <SelectItem value="DONE">DONE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Priority</FieldLabel>
                <Select
                  value={priority}
                  onValueChange={(value) => {
                    setPriority(value as IssuePriority);
                  }}
                  disabled={!canCreateIssue || createIssueMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="LOW">LOW</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                      <SelectItem value="HIGH">HIGH</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Project</FieldLabel>
              <Select
                value={projectId}
                onValueChange={setProjectId}
                disabled={!canCreateIssue || createIssueMutation.isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel>Reporter</FieldLabel>
                <Select
                  value={reporterId}
                  onValueChange={setReporterId}
                  disabled={!canCreateIssue || createIssueMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select reporter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.displayName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Assignee</FieldLabel>
                <Select
                  value={assigneeId || 'unassigned'}
                  onValueChange={(value) => {
                    setAssigneeId(value === 'unassigned' ? '' : value);
                  }}
                  disabled={!canCreateIssue || createIssueMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.displayName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Could not create issue</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!canCreateIssue || createIssueMutation.isPending}
            >
              {createIssueMutation.isPending ? <Spinner className="me-2" /> : null}
              {createIssueMutation.isPending ? 'Creating...' : 'Create issue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
