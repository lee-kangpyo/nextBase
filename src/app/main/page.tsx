'use client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import { Grid } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useDialog } from '@/components/providers/DialogProvider';
import { toast } from 'react-toastify';
import { logout } from '@/actions/auth';
import Header from '@/components/layout/Header';
import UserList from './UserList';
import ToastCard from './ToastCard';
import NotificationCard from './NotificationCard';

export default function MainPage() {
  const { showAlert, showConfirm } = useDialog();
  const { data: session, status } = useSession();
  const roles = session?.user?.roles || [];

  const logoutHandler = async () => {
    await logout();
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <Header onLogout={logoutHandler} />
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, p: 3 }}>
        {/* 알림/액션/토스트 카드 */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NotificationCard />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ToastCard />
          </Grid>
        </Grid>

        {/* 유저 리스트 위치 */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            유저 리스트
          </Typography>
          <UserList />
        </Box>
      </Box>
    </>
  );
}
