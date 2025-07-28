// src/components/layout/Header.tsx
'use client';
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
  Skeleton,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { logout } from '@/actions/auth';

export default function Header() {
  const { data: session, status } = useSession();
  const userName = session?.user?.userName;
  const roles = session?.user?.roles || [];

  const logoutHandler = async () => {
    await logout();
    signOut({ callbackUrl: '/login' });
  };

  // 로딩 상태일 때 스켈레톤 UI 표시
  if (status === 'loading') {
    return (
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            MyService
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="rectangular" width={60} height={24} />
            <Skeleton variant="rectangular" width={80} height={36} />
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  // 인증된 상태일 때만 UI 표시 (인증되지 않은 사용자는 로그인 화면으로 리다이렉트됨)
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">
          MyService
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          {userName && <Typography variant="body1">{userName} 님</Typography>}
          <Stack direction="row" spacing={1}>
            {roles.length > 0 ? (
              roles.map((role: string) => (
                <Chip key={role} label={role} color="secondary" size="small" />
              ))
            ) : (
              <Chip label="권한 없음" color="default" size="small" />
            )}
          </Stack>
          <Button color="inherit" onClick={logoutHandler}>
            로그아웃
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
