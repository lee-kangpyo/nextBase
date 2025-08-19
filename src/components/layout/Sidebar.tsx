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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NextLink from 'next/link'; // Next.js Link 추가
import { getIconComponent, STATIC_ICONS } from '@/utils/iconHelper';
import { useUserMenuService } from '@/services/menu';
import { useSidebarStore } from '@/stores/sidebarStore';
import SidebarSkeleton from './SidebarSkeleton';

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

export default function MiniSidebar() {
  const { isOpen, expandedMenus, toggleSidebar, toggleMenuGroup } =
    useSidebarStore();

  // expandedMenus를 Set으로 변환 (기존 코드 호환성)
  const expandedMenusSet = new Set(expandedMenus);

  // 동적 메뉴 데이터 가져오기
  const { userMenu } = useUserMenuService();
  const { data: menuItems, isLoading, error } = userMenu;

  // 동적 메뉴를 사이드바 형식으로 변환 (재귀적)
  const convertMenuToSidebarFormat = (items: any[]): any[] => {
    return items.map((item: any, index: number) => ({
      label: item.menuName,
      path: item.menuUrl,
      icon: getIconComponent(item.iconName),
      children:
        item.children && item.children.length > 0
          ? convertMenuToSidebarFormat(item.children)
          : undefined,
      key: item.menuUrl || `menu-${item.menuName}-${index}`,
    }));
  };

  const dynamicMenuItems = React.useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];
    return convertMenuToSidebarFormat(menuItems);
  }, [menuItems]);

  const handleMenuClick = (item: any) => {
    console.log('🔍 handleMenuClick 호출:', item);
    if (item.children) {
      // path가 null이면 key를 사용
      const menuPath = item.path || item.key;
      toggleMenuGroup(menuPath);
    } else {
      console.log('❌ children이 없음');
    }
  };

  const renderMenuItem = (item: any, level: number = 0, index: number = 0) => {
    // path가 null이면 key를 사용
    const menuPath = item.path || item.key;
    const isExpanded = expandedMenusSet.has(menuPath);
    const hasChildren = item.children && item.children.length > 0;

    const menuButton = (
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: isOpen ? 'initial' : 'center',
          px: 2.5,
          pl: isOpen ? 2.5 + level * 2 : 2.5,
        }}
        component={hasChildren ? 'div' : NextLink} // hasChildren이면 div, 아니면 NextLink
        href={hasChildren ? undefined : menuPath}
        onClick={hasChildren ? () => handleMenuClick(item) : undefined}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isOpen ? 2 : 'auto',
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.label} sx={{ opacity: isOpen ? 1 : 0 }} />
        {hasChildren &&
          isOpen &&
          (isExpanded ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
    );

    return (
      <React.Fragment key={menuPath}>
        <ListItem
          disablePadding
          sx={{
            display: 'block',
            position: 'relative',
          }}
        >
          {isOpen ? (
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
                          component={NextLink} // NextLink 사용
                          href={child.path}
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
          <Collapse in={isExpanded && isOpen} timeout="auto" unmountOnExit>
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
      <Drawer variant="permanent" open={isOpen}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 64,
            width: isOpen ? drawerWidth : miniWidth,
            bgcolor: 'background.paper',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            px: 1.5,
            justifyContent: isOpen ? 'flex-end' : 'center',
          }}
        >
          <IconButton onClick={toggleSidebar} size="large">
            {isOpen ? (
              <ChevronLeftIcon fontSize="large" />
            ) : (
              <MenuIcon fontSize="large" />
            )}
          </IconButton>
        </Box>
        <List>
          {isLoading ? (
            <SidebarSkeleton isOpen={isOpen} />
          ) : /* 동적 메뉴 표시 */
          dynamicMenuItems && dynamicMenuItems.length > 0 ? (
            dynamicMenuItems.map((item: any, index: number) =>
              renderMenuItem(item, 0, index),
            )
          ) : null}
        </List>
      </Drawer>
    </Box>
  );
}
