// lib/theme.ts
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            background: {
              default: '#111827',  // very dark bg
              paper: '#1f2937',    // dark paper
            },
            text: {
              primary: '#f9fafb',
            },
          }
        : {}),
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
    },
  });
