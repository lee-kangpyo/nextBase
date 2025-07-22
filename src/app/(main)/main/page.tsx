'use client';
import { Box, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useDialog } from '@/components/providers/DialogProvider';
import UserList from '../members/UserList';
import ToastCard from './ToastCard';
import NotificationCard from './NotificationCard';

export default function MainPage() {
  return (
    <>
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
      </Box>
    </>
  );
}
