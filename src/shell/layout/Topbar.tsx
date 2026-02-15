'use client';

import { useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import InputBase from '@mui/material/InputBase';
import { useTheme, alpha } from '@mui/material/styles';
import { Menu, Sun, Moon, Search, Bell } from 'lucide-react';

import { useAppDispatch, toggleSidebar } from '../store';
import { TOPBAR_HEIGHT } from '../constants';

interface TopbarProps {
  readonly drawerWidth: number;
}

export function Topbar({ drawerWidth }: TopbarProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        height: TOPBAR_HEIGHT,
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        transition: theme.transitions.create(['width', 'margin-left'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: TOPBAR_HEIGHT,
          minHeight: `${TOPBAR_HEIGHT}px !important`,
          gap: 1,
          px: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Menu Toggle */}
        <IconButton
          onClick={() => dispatch(toggleSidebar())}
          sx={{ color: 'text.secondary' }}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </IconButton>

        {/* Search */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            bgcolor: alpha(theme.palette.text.primary, 0.04),
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            maxWidth: 320,
            flex: 1,
          }}
        >
          <Search size={18} color={theme.palette.text.secondary} />
          <InputBase
            placeholder="Search…"
            sx={{
              ml: 1,
              flex: 1,
              fontSize: '0.875rem',
              '& input::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton sx={{ color: 'text.secondary' }} aria-label="Notifications">
              <Bell size={20} />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          {mounted && (
            <Tooltip title={resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton
                onClick={handleThemeToggle}
                sx={{ color: 'text.secondary' }}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Tooltip>
          )}

          {/* Avatar */}
          <Tooltip title="Account">
            <IconButton sx={{ ml: 0.5 }} aria-label="Account">
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
