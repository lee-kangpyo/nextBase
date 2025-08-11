'use client';
import { Box, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useDialog } from '@/components/providers/DialogProvider';
import ToastCard from './ToastCard';
import NotificationCard from './NotificationCard';

export default function MainPage() {
  return (
    <>
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, p: 3 }}>
        {/* 알림/액션/토스트 카드 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Box>
            <NotificationCard />
          </Box>
          <Box>
            <ToastCard />
          </Box>
        </Box>
      </Box>
    </>
  );
}
