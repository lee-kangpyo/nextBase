'use client'; // Error boundaries must be Client Components

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0, background: '#f0f2f5' }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgcolor="#f0f2f5"
        >
          <Card
            sx={{
              minWidth: 320,
              maxWidth: 400,
              width: '100%',
              boxShadow: 6,
              borderRadius: 3,
              p: 2,
            }}
          >
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
              >
                <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                  <ErrorOutlineIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" fontWeight={700} color="error" mb={1}>
                  문제가 발생했습니다
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  mb={2}
                >
                  예상치 못한 오류가 발생했습니다.
                  <br />
                  잠시 후 다시 시도해 주세요.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ fontWeight: 700, fontSize: '1rem' }}
                  onClick={() => (window.location.href = '/')}
                >
                  홈으로 이동
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{ fontWeight: 700, fontSize: '1rem' }}
                  onClick={() => reset()}
                >
                  다시 시도
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </body>
    </html>
  );
}
