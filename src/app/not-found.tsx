'use client';
import { Box, Typography, Button, Stack } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Stack spacing={3} alignItems="center" maxWidth={360} width="100%">
        <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: 'error.main' }} />
        <Typography variant="h2" fontWeight={700} color="error.main">
          404
        </Typography>
        <Typography variant="h5" fontWeight={500} textAlign="center">
          페이지를 찾을 수 없습니다.
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.
          <br />
          입력하신 주소가 정확한지 다시 한 번 확인해 주세요.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ borderRadius: 2, mt: 2 }}
          onClick={() => router.push('/main')}
        >
          홈으로 이동
        </Button>
      </Stack>
    </Box>
  );
}
