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

export default function MainPage() {
  const { showAlert, showConfirm } = useDialog();
  const { data: session, status } = useSession();
  const roles = session?.user?.roles || [];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3 }}>
      {/* 상단 사용자 정보 */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            환영합니다, {session?.user?.userName}
          </Typography>
          <Stack direction="row" spacing={1} mt={1}>
            {roles.length > 0 ? (
              roles.map((role: string) => (
                <Chip key={role} label={role} color="primary" size="small" />
              ))
            ) : (
              <Chip label="권한 없음" color="default" size="small" />
            )}
          </Stack>
        </Box>
        <Button
          variant="outlined"
          color="error"
          onClick={async () => {
            await logout();
            signOut({ callbackUrl: '/login' });
          }}
        >
          로그아웃
        </Button>
      </Stack>

      {/* 알림/액션 버튼 카드 */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                알림/액션
              </Typography>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    showAlert('안녕하세요', '안녕하세요', {
                      useSweetAlert: true,
                    })
                  }
                >
                  Alert
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    showConfirm(
                      '정말 삭제하시겠습니까?',
                      '정말 삭제하시겠습니까?',
                      {
                        useSweetAlert: true,
                      },
                    )
                  }
                >
                  Confirm
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                토스트 메시지
              </Typography>
              <Stack spacing={1}>
                <Button fullWidth onClick={() => toast.success('성공')}>
                  Success
                </Button>
                <Button fullWidth onClick={() => toast.error('실패')}>
                  Error
                </Button>
                <Button fullWidth onClick={() => toast.warning('경고')}>
                  Warning
                </Button>
                <Button fullWidth onClick={() => toast.info('정보')}>
                  Info
                </Button>
                <Button fullWidth onClick={() => toast.dark('어두운 테마')}>
                  Dark
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
