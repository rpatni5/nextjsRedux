import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/apiClient';

export interface Permission {
    _id: string;
    screenId: string | { _id: string; screenName: string };
    permissions: ('read' | 'write' | 'edit' | 'delete')[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface PermissionsState {
    permissions: Permission[];
    loading: boolean;
    error: string | null;
}

const initialState: PermissionsState = {
    permissions: [],
    loading: false,
    error: null,
};

export const addPermissionAsync = createAsyncThunk(
    'permissions/add',
    async (payload: { screenId: string; permissions: ('read' | 'write' | 'edit' | 'delete')[] }, { rejectWithValue }) => {
        try {
            const response = await apiClient('/api/permissions', {
                method: 'POST',
                body: payload,
            });
            return response;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchPermissionsAsync = createAsyncThunk(
    'permissions/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient('/api/permissions');
            return response;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const editPermissionAsync = createAsyncThunk(
    'permissions/edit',
    async (payload: { id: string; screenId: string; permissions: ('read' | 'write' | 'edit' | 'delete')[] }, { rejectWithValue }) => {
        try {
            const response = await apiClient(`/api/permissions/${payload.id}`, {
                method: 'PUT',
                body: { permissions: payload.permissions , screenId : payload.screenId },
            });
            return response;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deletePermissionAsync = createAsyncThunk(
    'permissions/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient(`/api/permissions/${id}`, {
                method: 'DELETE',
            });
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const permissionsSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addPermissionAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPermissionAsync.fulfilled, (state, action: PayloadAction<Permission>) => {
                state.permissions.push(action.payload);
                state.loading = false;
            })
            .addCase(addPermissionAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchPermissionsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissionsAsync.fulfilled, (state, action: PayloadAction<Permission[]>) => {
                state.permissions = action.payload;
                state.loading = false;
            })
            .addCase(fetchPermissionsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(editPermissionAsync.fulfilled, (state, action: PayloadAction<Permission>) => {
                const index = state.permissions.findIndex(p => p._id === action.payload._id);
                if (index !== -1) state.permissions[index] = action.payload;
            })

            .addCase(deletePermissionAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.permissions = state.permissions.filter(p => p._id !== action.payload);
            });
    },
});

export default permissionsSlice.reducer;
