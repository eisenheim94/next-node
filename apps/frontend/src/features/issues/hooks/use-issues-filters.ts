'use client';

import type { FormEvent } from 'react';

import {
  applySearch,
  clearPriority,
  clearSearch,
  clearStatus,
  resetSort,
  selectIssuesFilterState,
  selectIssuesQueryParams,
  setLimit,
  setPage,
  setPriority,
  setSearchInput,
  setSort,
  setStatus,
} from '@/store/features/issues/issues-filters-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  ISSUE_PRIORITY_OPTIONS,
  ISSUE_SORT_OPTIONS,
  ISSUE_STATUS_OPTIONS,
} from '@/features/issues/constants';

export function useIssuesFilters() {
  const dispatch = useAppDispatch();

  const issueQuery = useAppSelector(selectIssuesQueryParams);
  const issueFilters = useAppSelector(selectIssuesFilterState);

  function goToPreviousPage() {
    dispatch(setPage(Math.max(1, issueFilters.page - 1)));
  }

  function goToNextPage() {
    dispatch(setPage(issueFilters.page + 1));
  }

  function handleLimitChange(limit: number) {
    dispatch(setLimit(limit));
  }

  function handleStatusFilterChange(value: string) {
    const status = ISSUE_STATUS_OPTIONS.find((option) => option === value);
    dispatch(setStatus(status));
  }

  function handlePriorityFilterChange(value: string) {
    const priority = ISSUE_PRIORITY_OPTIONS.find((option) => option === value);
    dispatch(setPriority(priority));
  }

  function handleSortChange(value: string) {
    const nextSort = ISSUE_SORT_OPTIONS[value];

    if (!nextSort) {
      return;
    }

    dispatch(setSort(nextSort));
  }

  function handleSearchInputChange(value: string) {
    dispatch(setSearchInput(value));
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(applySearch());
  }

  function handleClearSearch() {
    dispatch(clearSearch());
  }

  function handleClearStatus() {
    dispatch(clearStatus());
  }

  function handleClearPriority() {
    dispatch(clearPriority());
  }

  function handleResetSort() {
    dispatch(resetSort());
  }

  return {
    issueFilters,
    issueQuery,
    goToNextPage,
    goToPreviousPage,
    handleClearPriority,
    handleClearSearch,
    handleClearStatus,
    handleLimitChange,
    handlePriorityFilterChange,
    handleResetSort,
    handleSearchInputChange,
    handleSearchSubmit,
    handleSortChange,
    handleStatusFilterChange,
  };
}
