'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';
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
import type { PaginationMeta } from '@/types/api';

interface PaginationControlsProps {
  className?: string;
  itemLabel?: string;
  limit: number;
  pageSizeOptions?: number[];
  paginationMeta: PaginationMeta;
  onLimitChange: (limit: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function PaginationControls({
  className,
  itemLabel = 'items',
  limit,
  pageSizeOptions = [6, 12, 24],
  paginationMeta,
  onLimitChange,
  onNextPage,
  onPreviousPage,
}: PaginationControlsProps) {
  const id = useId();
  const limitId = `pagination-limit-${id}`;

  return (
    <section
      className={cn(
        'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <p className="text-xs text-muted-foreground">
        Page {paginationMeta.page} of {paginationMeta.totalPages || 1}{' · '}
        {paginationMeta.totalItems} total {itemLabel}
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
                {pageSizeOptions.map((pageSizeOption) => (
                  <SelectItem
                    key={pageSizeOption}
                    value={String(pageSizeOption)}
                  >
                    {pageSizeOption}
                  </SelectItem>
                ))}
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
