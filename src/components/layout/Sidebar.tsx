'use client';

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 220;
const miniWidth = 56;

const openedMixin = (theme: any) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden' as const,
});

const closedMixin = (theme: any) => ({
  width: miniWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden' as const,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const menuItems = [
  { label: '대시보드', path: '/main', icon: <DashboardIcon /> },
  { label: 'FTP 전송', path: '/interface/ftp', icon: <CloudUploadIcon /> },
  { label: '이메일 전송', path: '/interface/email', icon: <EmailIcon /> },
  {
    label: '관리자',
    path: '/admin',
    icon: <AdminPanelSettingsIcon />,
    children: [
      { label: '회원관리', path: '/admin/members', icon: <PersonIcon /> },
      { label: '권한관리', path: '/admin/roles', icon: <SecurityIcon /> },
    ],
  },
];

export default function MiniSidebar() {
  const [open, setOpen] = React.useState(false);
  const [expandedMenus, setExpandedMenus] = React.useState<Set<string>>(
    new Set(),
  );

  const handleMenuClick = (item: any) => {
    if (item.children) {
      setExpandedMenus((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(item.path)) {
          newSet.delete(item.path);
        } else {
          newSet.add(item.path);
        }
        return newSet;
      });
    }
  };

  const renderMenuItem = (item: any, level: number = 0, index: number = 0) => {
    const isExpanded = expandedMenus.has(item.path);
    const hasChildren = item.children && item.children.length > 0;

    const menuButton = (
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          pl: open ? 2.5 + level * 2 : 2.5,
        }}
        href={hasChildren ? undefined : item.path}
        component={hasChildren ? 'div' : 'a'}
        onClick={hasChildren ? () => handleMenuClick(item) : undefined}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 2 : 'auto',
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
        {hasChildren && open && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
    );

    return (
      <React.Fragment key={item.path}>
        <ListItem
          disablePadding
          sx={{
            display: 'block',
            position: 'relative',
          }}
        >
          {open ? (
            menuButton
          ) : (
            <Box
              sx={{
                position: 'relative',
                '&:hover .submenu': {
                  display: 'block',
                },
              }}
            >
              {hasChildren ? (
                menuButton
              ) : (
                <Tooltip title={item.label} placement="right">
                  {menuButton}
                </Tooltip>
              )}
              {hasChildren && (
                <Box
                  className="submenu"
                  sx={{
                    position: 'fixed',
                    left: miniWidth + 8,
                    top: 64 + index * 48, // 헤더 높이(64) + 메뉴 항목 높이(48) * 인덱스
                    bgcolor: 'background.paper',
                    boxShadow: 6,
                    borderRadius: 1,
                    zIndex: 9999,
                    display: 'none',
                    minWidth: 200,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -8,
                      top: 16,
                      width: 0,
                      height: 0,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      borderRight: '8px solid',
                      borderRightColor: 'divider',
                    },
                  }}
                >
                  <List>
                    {item.children.map((child: any) => (
                      <ListItem key={child.path} disablePadding>
                        <ListItemButton
                          href={child.path}
                          component="a"
                          sx={{
                            minHeight: 40,
                            px: 2,
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child: any) =>
                renderMenuItem(child, level + 1),
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 64,
            width: open ? drawerWidth : miniWidth,
            bgcolor: 'background.paper',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            px: 1.5,
            justifyContent: open ? 'flex-end' : 'center',
          }}
        >
          <IconButton onClick={() => setOpen(!open)} size="large">
            {open ? (
              <ChevronLeftIcon fontSize="large" />
            ) : (
              <MenuIcon fontSize="large" />
            )}
          </IconButton>
        </Box>
        <List>
          {menuItems.map((item, index) => renderMenuItem(item, 0, index))}
        </List>
      </Drawer>
    </Box>
  );
}
