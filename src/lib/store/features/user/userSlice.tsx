// lib/store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/interfaces/user';
import { apiClient } from '@/lib/api/apiClient';

  
export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  return await apiClient<User[]>('/api/users');
});

export const deleteUser = createAsyncThunk('users/delete', async (id: string) => {
  await apiClient(`/api/users/${id}`, { method: 'DELETE' });
  return id;
});

interface UserState {
  users: User[];
  loading: boolean;
}

const initialState: UserState = {
  users: [],
  loading: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  },
});

export default userSlice.reducer;
