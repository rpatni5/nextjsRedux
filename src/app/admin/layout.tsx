'use client';

import React from 'react';
// import Sidebar from '@/components/Sidebar';
// import Navbar from '@/components/Navbar';
import { useAppSelector } from '@/lib/store/hooks';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '@/lib/theme';

import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-grids/styles/material.css';
import { registerLicense } from '@syncfusion/ej2-base';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('@/components/Sidebar'));
const Navbar = dynamic(() => import('@/components/Navbar'));
registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXhcdXRQRWBcVkJyWUU=');

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { mode ,sidebarCollapsed} = useAppSelector((state) => state.theme);
  const theme = getTheme(mode === 'dark' ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div
          className={`flex flex-col flex-1 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-[240px]'}`}
        >
          <div className="h-[60px]">
            <Navbar />
          </div>

          <div className="flex-1 overflow-auto px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
