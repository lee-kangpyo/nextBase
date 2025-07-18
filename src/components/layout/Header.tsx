// src/components/layout/Header.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { useSession } from 'next-auth/react';

export default function Header({ onLogout }: { onLogout?: () => void }) {
  const { data: session } = useSession();
  debugger;
  const userName = session?.user?.userName;
  const roles = session?.user?.roles || [];

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
          {onLogout && (
            <Button color="inherit" onClick={onLogout}>
              로그아웃
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
