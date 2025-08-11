'use client';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Block as BlockIcon } from '@mui/icons-material';

export default function DeniedPage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <BlockIcon
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
            }}
          />
          <Typography variant="h4" gutterBottom color="error">
            접근 권한이 없습니다
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            해당 페이지에 접근할 권한이 없습니다.
            <br />
            관리자에게 문의하시기 바랍니다.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/main')}
            sx={{ mr: 2 }}
          >
            메인으로 이동
          </Button>
          <Button variant="outlined" onClick={() => router.back()}>
            이전 페이지로
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
