'use client';

import { type ReactNode, useEffect } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { useAppSelector, useAppDispatch, setSidebarOpen } from '../store';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, TOPBAR_HEIGHT } from '../constants';

interface AdminLayoutProps {
  readonly children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useAppDispatch();
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((s) => s.layout);

  const effectiveWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  const currentDrawerWidth = sidebarOpen && !isMobile ? effectiveWidth : 0;

  // Auto-close sidebar on mobile, auto-open on desktop
  useEffect(() => {
    dispatch(setSidebarOpen(!isMobile));
  }, [isMobile, dispatch]);

  const handleDrawerClose = () => {
    dispatch(setSidebarOpen(false));
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        onClose={handleDrawerClose}
      />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          ml: `${currentDrawerWidth}px`,
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Topbar */}
        <Topbar drawerWidth={currentDrawerWidth} />

        {/* Page content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            mt: `${TOPBAR_HEIGHT}px`,
            maxWidth: 1600,
            width: '100%',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
