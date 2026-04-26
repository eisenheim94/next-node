import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  GetIssuesParams,
  IssuePriority,
  IssueSortBy,
  IssueStatus,
  SortOrder,
} from '@/types/issue';

interface IssueFiltersState {
  page: number;
  limit: number;
  sortBy: IssueSortBy;
  sortOrder: SortOrder;
  status?: IssueStatus;
  priority?: IssuePriority;
  searchInput: string;
  appliedSearch?: string;
}

const initialState: IssueFiltersState = {
  page: 1,
  limit: 12,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
  searchInput: '',
};

const issuesFiltersSlice = createSlice({
  name: 'issuesFilters',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.page = 1;
      state.limit = action.payload;
    },
    setStatus(state, action: PayloadAction<IssueStatus | undefined>) {
      state.page = 1;
      state.status = action.payload;
    },
    clearStatus(state) {
      state.page = 1;
      state.status = undefined;
    },
    setPriority(state, action: PayloadAction<IssuePriority | undefined>) {
      state.page = 1;
      state.priority = action.payload;
    },
    clearPriority(state) {
      state.page = 1;
      state.priority = undefined;
    },
    setSort(
      state,
      action: PayloadAction<{
        sortBy: IssueSortBy;
        sortOrder: SortOrder;
      }>,
    ) {
      state.page = 1;
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    resetSort(state) {
      state.page = 1;
      state.sortBy = initialState.sortBy;
      state.sortOrder = initialState.sortOrder;
    },
    setSearchInput(state, action: PayloadAction<string>) {
      state.searchInput = action.payload;
    },
    applySearch(state) {
      state.page = 1;
      state.appliedSearch = state.searchInput.trim() || undefined;
    },
    clearSearch(state) {
      state.page = 1;
      state.searchInput = '';
      state.appliedSearch = undefined;
    },
  },
});

export const {
  setPage,
  setLimit,
  setStatus,
  clearStatus,
  setPriority,
  clearPriority,
  setSort,
  resetSort,
  setSearchInput,
  applySearch,
  clearSearch,
} = issuesFiltersSlice.actions;

export const issuesFiltersReducer = issuesFiltersSlice.reducer;

export function selectIssuesQueryParams(
  state: { issuesFilters: IssueFiltersState },
): GetIssuesParams {
  return {
    page: state.issuesFilters.page,
    limit: state.issuesFilters.limit,
    sortBy: state.issuesFilters.sortBy,
    sortOrder: state.issuesFilters.sortOrder,
    status: state.issuesFilters.status,
    priority: state.issuesFilters.priority,
    search: state.issuesFilters.appliedSearch,
  };
}

export function selectIssuesFilterState(
  state: { issuesFilters: IssueFiltersState },
) {
  return state.issuesFilters;
}
