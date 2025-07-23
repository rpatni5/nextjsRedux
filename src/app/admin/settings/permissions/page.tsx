'use client';

import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  addPermissionAsync,
  fetchPermissionsAsync,
  editPermissionAsync,
  deletePermissionAsync,
} from '@/lib/store/features/permissions/permissionSlice';
import { fetchScreensAsync } from '@/lib/store/features/screens/screensSlice';

const permissionOptions = ['read', 'write', 'edit', 'delete'];

export default function Permission() {
  const dispatch = useAppDispatch();
  const { permissions, loading } = useAppSelector((state) => state.permission);
  const { screens } = useAppSelector((state) => state.screens);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [open, setOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<null | { _id: string; screenId: string; permissions: string[] }>(null);
  const [screenId, setScreenId] = useState('');
  const [permission, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchPermissionsAsync());
    dispatch(fetchScreensAsync());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenId || permission.length === 0) {
      alert('Please select screen and permissions.');
      return;
    }

    if (editingScreen) {
      dispatch(
        editPermissionAsync({
          id: editingScreen._id,
          screenId, 
          permissions: permission as ('read' | 'write' | 'edit' | 'delete')[],
        })
      );
    } else {
      dispatch(
        addPermissionAsync({
          screenId,
          permissions: permission as ('read' | 'write' | 'edit' | 'delete')[],
        })
      );
    }
    

    setScreenId('');
    setPermissions([]);
    setEditingScreen(null);
    setOpen(false);
  };

  const handleEdit = (row: any) => {
    setEditingScreen(row);
    const screenId = typeof row.screenId === 'object' ? row.screenId._id : row.screenId;
    setScreenId(screenId);

    setPermissions(row.permissions || []);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this permission?')) {
      dispatch(deletePermissionAsync(id));
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'screenId',
      headerName: 'Screen Name',
      flex: 1,
      valueGetter: (params: any) => {
        return params.screenName ;
      },
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
        <Box>
          <IconButton onClick={() => handleEdit(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

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
            >
              {screens.map((screen) => (
                <MenuItem key={screen._id} value={screen._id}>
                  {screen.screenName}
                </MenuItem>
              ))}
            </Select>
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
