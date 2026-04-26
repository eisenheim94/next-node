import { configureStore } from '@reduxjs/toolkit';

import { issuesFiltersReducer } from '@/store/features/issues/issues-filters-slice';
import { uiReducer } from '@/store/features/ui/ui-slice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    issuesFilters: issuesFiltersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
