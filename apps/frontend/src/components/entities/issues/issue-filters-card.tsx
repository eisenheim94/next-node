'use client';

import type { FormEvent } from 'react';

import { FadersHorizontalIcon } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { GetIssuesParams } from '@/types/issue';

interface IssueFiltersCardProps {
  issueQuery: GetIssuesParams;
  searchInput: string;
  setSearchInput: (value: string) => void;
  onClearSearch: () => void;
  onPriorityFilterChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSortChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

export function IssueFiltersCard({
  issueQuery,
  searchInput,
  setSearchInput,
  onClearSearch,
  onPriorityFilterChange,
  onSearchSubmit,
  onSortChange,
  onStatusFilterChange,
}: IssueFiltersCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FadersHorizontalIcon className="text-muted-foreground" />
          <CardTitle>Filters and sorting</CardTitle>
        </div>
        <CardDescription>
          Narrow the issue list by text, status, priority, or ordering.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <form
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5"
          onSubmit={onSearchSubmit}
        >
          <Field className="xl:col-span-2">
            <FieldLabel htmlFor="issue-search">Search</FieldLabel>
            <Input
              id="issue-search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search title or description"
            />
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={issueQuery.status ?? 'all'}
              onValueChange={(value) => {
                onStatusFilterChange(value === 'all' ? '' : value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All statuses</SelectItem>
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
              value={issueQuery.priority ?? 'all'}
              onValueChange={(value) => {
                onPriorityFilterChange(value === 'all' ? '' : value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="LOW">LOW</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Sort</FieldLabel>
            <Select
              value={`${issueQuery.sortBy ?? 'createdAt'}:${issueQuery.sortOrder ?? 'DESC'}`}
              onValueChange={onSortChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="createdAt:DESC">Newest first</SelectItem>
                  <SelectItem value="createdAt:ASC">Oldest first</SelectItem>
                  <SelectItem value="updatedAt:DESC">Recently updated</SelectItem>
                  <SelectItem value="title:ASC">Title A-Z</SelectItem>
                  <SelectItem value="priority:DESC">Priority high-low</SelectItem>
                  <SelectItem value="status:ASC">Status A-Z</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <div className="flex flex-wrap items-end gap-3 xl:col-span-5">
            <Button type="submit">Apply search</Button>
            <Button type="button" variant="outline" onClick={onClearSearch}>
              Clear search
            </Button>
          </div>
        </form>

        {issueQuery.search || issueQuery.status || issueQuery.priority ? (
          <p className="text-xs text-muted-foreground">
            Active filters:
            {issueQuery.search ? ` search="${issueQuery.search}"` : ''}
            {issueQuery.status ? ` status=${issueQuery.status}` : ''}
            {issueQuery.priority ? ` priority=${issueQuery.priority}` : ''}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
