'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

import { navigation } from '@/config/navigation';
import { AOE_BRAND, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, TOPBAR_HEIGHT } from '@/config/constants';
import { useAppDispatch, toggleSidebarCollapse } from '@/store';

interface SidebarProps {
  readonly open: boolean;
  readonly collapsed: boolean;
  readonly isMobile: boolean;
  readonly onClose: () => void;
}

export function Sidebar({ open, collapsed, isMobile, onClose }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const effectiveWidth = collapsed && !isMobile ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Logo & Brand */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: collapsed && !isMobile ? 1.5 : 2.5,
          height: TOPBAR_HEIGHT,
          minHeight: TOPBAR_HEIGHT,
          justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AOE_BRAND.logo}
          alt={AOE_BRAND.name}
          width={36}
          height={36}
          style={{ flexShrink: 0, objectFit: 'contain' }}
        />
        {(!collapsed || isMobile) && (
          <Typography
            variant="subtitle1"
            noWrap={false}
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              lineHeight: 1.2,
              color: 'text.primary',
            }}
          >
            ALPHA Office
            <br />
            Escalations
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: collapsed && !isMobile ? 1 : 2,
          py: 1.5,
        }}
      >
        {navigation.map((section) => (
          <Box key={section.label ?? 'default'} sx={{ mb: 1.5 }}>
            {section.label && (!collapsed || isMobile) && (
              <Typography
                variant="overline"
                sx={{
                  px: 1,
                  mb: 0.5,
                  display: 'block',
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}
              >
                {section.label}
              </Typography>
            )}
            {collapsed && !isMobile && section.label && (
              <Divider sx={{ my: 1 }} />
            )}
            <List disablePadding>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

                const button = (
                  <ListItemButton
                    key={item.path}
                    component={Link}
                    href={item.path}
                    selected={isActive}
                    onClick={isMobile ? onClose : undefined}
                    sx={{
                      minHeight: 44,
                      px: collapsed && !isMobile ? 1.5 : 2,
                      justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        justifyContent: 'center',
                        color: isActive ? 'inherit' : 'text.secondary',
                        minWidth: collapsed && !isMobile ? 'unset' : 40,
                      }}
                    >
                      <Icon size={20} />
                    </ListItemIcon>
                    {(!collapsed || isMobile) && (
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      />
                    )}
                  </ListItemButton>
                );

                if (collapsed && !isMobile) {
                  return (
                    <Tooltip key={item.path} title={item.title} placement="right" arrow>
                      {button}
                    </Tooltip>
                  );
                }

                return <Box key={item.path}>{button}</Box>;
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Collapse Toggle (desktop only) */}
      {!isMobile && (
        <>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: collapsed ? 'center' : 'flex-end',
              p: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={() => dispatch(toggleSidebarCollapse())}
              sx={{ color: 'text.secondary' }}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );

  // Mobile: temporary overlay drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop: persistent sidebar
  if (!open) return null;

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: effectiveWidth,
        bgcolor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        display: { xs: 'none', lg: 'block' },
      }}
    >
      {drawerContent}
    </Box>
  );
}
