import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isPageLoading: boolean;
}

const initialState: UiState = {
  isPageLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPageLoading(state, action: PayloadAction<boolean>) {
      state.isPageLoading = action.payload;
    },
  },
});

export const { setPageLoading } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
