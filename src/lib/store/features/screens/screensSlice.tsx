
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/apiClient';

interface Screen {
  _id: string;
  screenName: string;
  route: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ScreensState {
  screens: Screen[];
  loading: boolean;
  error: string | null;
}

const initialState: ScreensState = {
  screens: [],
  loading: false,
  error: null,
};

export const addScreenAsync = createAsyncThunk(
  'screens/addScreenAsync',
  async (
    payload: { screenName: string; route: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient('/api/screens', {
        method: 'POST',
        body: payload,
      });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchScreensAsync = createAsyncThunk(
  'screens/fetchScreens',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient('/api/screens');
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const editScreenAsync = createAsyncThunk(
  'screens/editScreen',
  async (
    { id, screenName, route }: { id: string; screenName: string; route: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient(`/api/screens/${id}`, {
        method: 'PUT',
        body: { screenName, route },
      });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteScreenAsync = createAsyncThunk(
  'screens/deleteScreen',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient(`/api/screens/${id}`, {
        method: 'DELETE',
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


const screensSlice = createSlice({
  name: 'screens',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addScreenAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScreenAsync.fulfilled, (state, action: PayloadAction<Screen>) => {
        state.screens.push(action.payload);
        state.loading = false;
      })
      .addCase(addScreenAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchScreensAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScreensAsync.fulfilled, (state, action: PayloadAction<Screen[]>) => {
        state.screens = action.payload;
        state.loading = false;
      })
      .addCase(fetchScreensAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Edit
      .addCase(editScreenAsync.fulfilled, (state, action: PayloadAction<Screen>) => {
        const index = state.screens.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.screens[index] = action.payload;
      })

      // Delete
      .addCase(deleteScreenAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.screens = state.screens.filter(screen => screen._id !== action.payload);
      });
  },
});

export default screensSlice.reducer;
