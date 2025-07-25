// components/MemoizedRow.tsx
import React from 'react';
import { IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface MemoizedRowProps {
  row: any;
  onEdit: (row: any) => void;
  onDelete: (id: string) => void;
}

const MemoizedRow: React.FC<MemoizedRowProps> = ({ row, onEdit, onDelete }) => {
  return (
    <Box>
      <IconButton onClick={() => onEdit(row)} color="primary">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => onDelete(row._id)} color="error">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default React.memo(MemoizedRow);
