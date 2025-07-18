// redux/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark';
  sidebarCollapsed: boolean;
  fontSize: number;
  primaryColor: string;
}

const initialState: ThemeState = {
  mode: 'light',
  sidebarCollapsed: false,
  fontSize: 16,
  primaryColor: '#0070f3',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
   
  },
});

export const { toggleTheme, toggleSidebar } = themeSlice.actions;
export default themeSlice.reducer;
