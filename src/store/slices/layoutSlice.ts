import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LayoutState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
}

const initialState: LayoutState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapse(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  setSidebarCollapsed,
} = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
