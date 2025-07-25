'use client';

import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  addPermissionAsync,
  fetchPermissionsAsync,
  editPermissionAsync,
  deletePermissionAsync,
} from '@/lib/store/features/permissions/permissionSlice';
import { fetchScreensAsync } from '@/lib/store/features/screens/screensSlice';
import { Role } from '@/lib/role';
// import MemoizedRow from '@/components/MemoizedRow';
import React from 'react';
import dynamic from 'next/dynamic';
import VirtualizedMenuList from '@/components/VirtualizedMenuList';

const MemoizedRow = dynamic(() => import('@/components/MemoizedRow'));
// const VirtualizedMenuList = lazy(() => import('@/components/VirtualizedMenuList'));

const permissionOptions = ['read', 'write', 'edit', 'delete'];

export default function Permission() {
  const dispatch = useAppDispatch();
  const { permissions, loading } = useAppSelector((state) => state.permission);
  const { screens } = useAppSelector((state) => state.screens);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [open, setOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<null | { _id: string; screenId: string; permissions: string[]; role: 'admin' | 'worker' }>(null);

  const [screenId, setScreenId] = useState('');
  const [permission, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState<Role>('admin');

  // useEffect(() => {
  //   const dummy = Array.from({ length: 500 }, (_, i) => ({
  //     _id: `id-${i}`,
  //     screenName: `Screen ${i + 1}`,
  //   }));
  //   dispatch({ type: 'screens/fetchScreens/fulfilled', payload: dummy });
  // }, []);

  // useEffect(() => {
  //   console.log("Effect started");

  //   return () => {
  //     console.log("Effect cleaned up");
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     console.log('resize started:', window.innerWidth);
  //   };

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //     console.log('resized ended');
  //   };
  // }, []);


  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log('time', new Date().toLocaleTimeString());
  //   }, 2000);

  //   return () => {
  //     clearInterval(intervalId);
  //     console.log("cleared timeout")
  //   };
  // }, []);


  // useEffect(() => {
  //   dispatch(fetchPermissionsAsync());
  //   dispatch(fetchScreensAsync());
  // }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (isMounted) {
        dispatch(fetchPermissionsAsync());
        dispatch(fetchScreensAsync());
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, [dispatch]);
  

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!screenId || permission.length === 0) {
        alert('Please select screen and permissions.');
        return;
      }

      const payload = {
        screenId,
        role,
        permissions: permission as ('read' | 'write' | 'edit' | 'delete')[],
      };

      if (editingScreen) {
        dispatch(editPermissionAsync({ id: editingScreen._id, ...payload }));
      } else {
        dispatch(addPermissionAsync(payload));
      }

      setScreenId('');
      setPermissions([]);
      setRole('admin');
      setEditingScreen(null);
      setOpen(false);
    },
    [screenId, permission, role, editingScreen, dispatch]
  );

  const handleEdit = useCallback((row: any) => {
    setEditingScreen(row);
    const screenId = typeof row.screenId === 'object' ? row.screenId._id : row.screenId;
    setScreenId(screenId);
    setPermissions(row.permissions || []);
    setRole(row.role);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm('Are you sure you want to delete this permission?')) {
        dispatch(deletePermissionAsync(id));
      }
    },
    [dispatch]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'screenId',
        headerName: 'Screen Name',
        flex: 1,
        valueGetter: (params: any) => params?.screenName,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'role',
        headerName: 'Role',
        flex: 1,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'permissions',
        headerName: 'Permissions',
        flex: 2,
        valueGetter: (params) => (params as ('read' | 'write' | 'edit' | 'delete')[])?.join(', '),
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <Suspense fallback={<div>Loading...</div>}>
            <MemoizedRow row={params.row} onEdit={handleEdit} onDelete={handleDelete} />
          </Suspense>
        )
        
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Permission Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingScreen(null);
            setScreenId('');
            setPermissions([]);
            setOpen(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          Add Permission
        </Button>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={permissions}
          getRowId={(row) => row._id}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          loading={loading}
          sx={{
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5', fontWeight: 'bold' },
            '& .MuiDataGrid-cell': { fontSize: '0.95rem', borderBottom: '1px solid #eee' },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
            '& .MuiDataGrid-footerContainer': { backgroundColor: '#f9f9f9' },
            '& .MuiDataGrid-virtualScroller': { backgroundColor: '#fff' },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            color: 'white',
            p: 1.5,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            paddingLeft: '30px',
          }}
        >
          {editingScreen ? 'Edit Permission' : 'Add Permission'}
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="screen-select-label">Screen</InputLabel>
            <Select
              labelId="screen-select-label"
              value={screenId}
              onChange={(e) => setScreenId(e.target.value)}
              label="Screen"
              sx={{ borderRadius: 2 }}
              MenuProps={{
                PaperProps: {
                  style: {
                    // maxHeight: ITEM_HEIGHT * 5,
                    width: 250,
                  },
                },
                MenuListProps: {
                  component: (props) => (
                    <Suspense fallback={<div>Loading.........</div>}>  
                      <VirtualizedMenuList {...props}
                        items={screens}
                        labelKey='screenName'
                        valueKey="_id"
                      />
                    </Suspense>

                  ),
                },
              }}
            />
          </FormControl>


          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="permission-select-label">Permissions</InputLabel>
            <Select
              labelId="permission-select-label"
              multiple
              label="Permissions"
              value={permission}
              onChange={(e) => setPermissions(e.target.value as string[])}
              renderValue={(selected) => selected.join(', ')}
              sx={{ borderRadius: 2 }}
            >
              {permissionOptions.map((perm) => (
                <MenuItem key={perm} value={perm}>
                  <Checkbox checked={permission.indexOf(perm) > -1} />
                  <ListItemText primary={perm} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              label="Role"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="worker">Worker</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'uppercase' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: 'linear-gradient(to right, #2563eb, #3b82f6)',
              borderRadius: 2,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              boxShadow: 'none',
              '&:hover': { background: 'linear-gradient(to right, #1d4ed8, #2563eb)' },
            }}
          >
            {editingScreen ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
