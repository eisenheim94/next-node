'use client';

import { FadersHorizontalIcon } from '@phosphor-icons/react';
import { XIcon } from 'lucide-react';

import { useIssuesFilters } from '@/features/issues/hooks/use-issues-filters';
import { Badge } from '@/components/ui/badge';
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

function getSortLabel(issueQuery: GetIssuesParams) {
  const value = `${issueQuery.sortBy ?? 'createdAt'}:${issueQuery.sortOrder ?? 'DESC'}`;

  switch (value) {
    case 'createdAt:DESC':
      return 'Newest first';
    case 'createdAt:ASC':
      return 'Oldest first';
    case 'updatedAt:DESC':
      return 'Recently updated';
    case 'title:ASC':
      return 'Title A-Z';
    case 'priority:DESC':
      return 'Priority high-low';
    case 'status:ASC':
      return 'Status A-Z';
    default:
      return value;
  }
}

function isDefaultSort(issueQuery: GetIssuesParams) {
  return (
    (issueQuery.sortBy ?? 'createdAt') === 'createdAt' &&
    (issueQuery.sortOrder ?? 'DESC') === 'DESC'
  );
}

export function IssueFiltersCard() {
  const {
    issueFilters,
    issueQuery,
    handleClearPriority,
    handleClearSearch,
    handleClearStatus,
    handlePriorityFilterChange,
    handleResetSort,
    handleSearchInputChange,
    handleSearchSubmit,
    handleSortChange,
    handleStatusFilterChange,
  } = useIssuesFilters();

  const searchInput = issueFilters.searchInput;
  const hasActiveBadges =
    Boolean(issueQuery.search) ||
    Boolean(issueQuery.status) ||
    Boolean(issueQuery.priority) ||
    !isDefaultSort(issueQuery);

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
          onSubmit={handleSearchSubmit}
        >
          <Field className="xl:col-span-2">
            <FieldLabel htmlFor="issue-search">Search</FieldLabel>
            <Input
              id="issue-search"
              value={searchInput}
              onChange={(event) => handleSearchInputChange(event.target.value)}
              placeholder="Search title or description"
            />
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={issueQuery.status ?? 'all'}
              onValueChange={(value) => handleStatusFilterChange(value === 'all' ? '' : value)}
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
              onValueChange={(value) => handlePriorityFilterChange(value === 'all' ? '' : value)}
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
              onValueChange={handleSortChange}
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
            <Button type="button" variant="outline" onClick={handleClearSearch}>
              Clear search
            </Button>
          </div>
        </form>

        {hasActiveBadges ? (
          <div className="flex flex-wrap gap-2">
            {issueQuery.search ? (
              <Badge variant="secondary" className="gap-1 pe-1 normal-case tracking-normal">
                <span>Search: {issueQuery.search}</span>
                <button
                  type="button"
                  aria-label="Remove search filter"
                  className="inline-flex size-4 items-center justify-center rounded-sm hover:bg-black/10"
                  onClick={handleClearSearch}
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ) : null}

            {issueQuery.status ? (
              <Badge variant="secondary" className="gap-1 pe-1 normal-case tracking-normal">
                <span>Status: {issueQuery.status}</span>
                <button
                  type="button"
                  aria-label="Remove status filter"
                  className="inline-flex size-4 items-center justify-center rounded-sm hover:bg-black/10"
                  onClick={handleClearStatus}
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ) : null}

            {issueQuery.priority ? (
              <Badge variant="secondary" className="gap-1 pe-1 normal-case tracking-normal">
                <span>Priority: {issueQuery.priority}</span>
                <button
                  type="button"
                  aria-label="Remove priority filter"
                  className="inline-flex size-4 items-center justify-center rounded-sm hover:bg-black/10"
                  onClick={handleClearPriority}
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ) : null}

            {!isDefaultSort(issueQuery) ? (
              <Badge variant="secondary" className="gap-1 pe-1 normal-case tracking-normal">
                <span>Sort: {getSortLabel(issueQuery)}</span>
                <button
                  type="button"
                  aria-label="Reset sort"
                  className="inline-flex size-4 items-center justify-center rounded-sm hover:bg-black/10"
                  onClick={handleResetSort}
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
