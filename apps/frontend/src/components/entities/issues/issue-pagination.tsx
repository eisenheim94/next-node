'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PaginatedIssues } from '@/types/issue';

interface IssuePaginationProps {
  className?: string;
  limit: number;
  limitId: string;
  paginationMeta: PaginatedIssues['meta'];
  onLimitChange: (limit: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function IssuePagination({
  className,
  limit,
  limitId,
  paginationMeta,
  onLimitChange,
  onNextPage,
  onPreviousPage,
}: IssuePaginationProps) {
  return (
    <section
      className={[
        'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-xs text-muted-foreground">
        Page {paginationMeta.page} of {paginationMeta.totalPages || 1} ·{' '}
        {paginationMeta.totalItems} total issues
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Field className="w-auto" orientation="horizontal">
          <FieldLabel htmlFor={limitId}>Per page</FieldLabel>
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              onLimitChange(Number(value));
            }}
          >
            <SelectTrigger id={limitId} className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Button
          type="button"
          variant="outline"
          onClick={onPreviousPage}
          disabled={!paginationMeta.hasPreviousPage}
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onNextPage}
          disabled={!paginationMeta.hasNextPage}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
