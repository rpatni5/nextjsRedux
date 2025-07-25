'use client';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  addScreenAsync,
  fetchScreensAsync,
  editScreenAsync,
  deleteScreenAsync,
} from '@/lib/store/features/screens/screensSlice';
import MemoizedRow from '@/components/MemoizedRow';

export default function Screens() {
  const dispatch = useAppDispatch();
  const { screens, loading } = useAppSelector((state) => state.screens);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [open, setOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<null | { _id: string; screenName: string; route: string }>(null);
  const [screenName, setScreenName] = useState('');
  const [screenRoute, setScreenRoute] = useState('');
  const [str, setStr] = useState(1);
  const [doubled, setDoubled] = useState(0);
  const [forceRender, setForceRender] = useState(false);
  useEffect(() => {
    dispatch(fetchScreensAsync());
  }, [dispatch]);

  // const vlue = useMemo(() => {
  //   console.log(' useMemo  ', str);
  //   return str * 10;
  // }, [str]);

  // useEffect(() => {
  //   console.log(' useEffect ran ', str);
  //   const result = str * 10;
  //   setDoubled(result);
  // },[str]);

  // useEffect(() => {
  //   console.log(' useEffect no deps');
  // });

  // console.log('rendered :', str, ' useMemo:', vlue, 'useEffect:', doubled);

  // const handleClick = () => {
  //   console.log('buton');
  //   setStr((x) => x + 1);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenName || !screenRoute) {
      alert('Please fill out both fields.');
      return;
    }
    if (editingScreen) {
      dispatch(editScreenAsync({ id: editingScreen._id, screenName, route: screenRoute }));
    } else {
      dispatch(addScreenAsync({ screenName, route: screenRoute }));
    }
    setScreenName('');
    setScreenRoute('');
    setEditingScreen(null);
    setOpen(false);
  };

  const handleEdit = (row: any) => {
    setEditingScreen(row);
    setScreenName(row.screenName);
    setScreenRoute(row.route);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this screen?')) {
      dispatch(deleteScreenAsync(id));
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'screenName',
      headerName: 'Screen Name',
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'route',
      headerName: 'Route',
      flex: 2,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <MemoizedRow
        row={params.row}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      ),
    },
  ];
  
  const save = () => {
    console.log(' Set same str ');
    setForceRender(prev => !prev);
  };
  

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Screen Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // handleClick()
            setEditingScreen(null);
            setScreenName('');
            setScreenRoute('');
            setOpen(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          Add Screen
        </Button>
        {/* <Button onClick={save}>Set same str</Button> */}
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={screens}
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
          {editingScreen ? 'Edit Screen' : 'Add Screen'}
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Screen Name"
            variant="outlined"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            label="Route"
            variant="outlined"
            value={screenRoute}
            onChange={(e) => setScreenRoute(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
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
