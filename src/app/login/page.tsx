// src/app/login/page.tsx

'use client'; // 클라이언트 컴포넌트로 지정

import { authService } from '@/services/authService';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
} from '@mui/material';
import NextLink from 'next/link'; // Next.js의 Link 컴포넌트를 MUI Link와 함께 사용

export default function LoginPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    authService
      .login(data.get('username') as string, data.get('password') as string)
      .then((res) => {
        console.log(res);
        // Cookies.set('accessToken', res.accessToken);
        // Cookies.set('refreshToken', res.refreshToken);
        // setCookie('accessToken', res.accessToken);
        // setCookie('refreshToken', res.refreshToken);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          로그인
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="이메일 주소"
            name="username"
            autoComplete="username"
            autoFocus
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              mt: 2,
            }}
          >
            {/* 수정된 부분: MUI Link의 component 속성으로 NextLink 사용 */}
            <Link component={NextLink} href="/reset-password" variant="body2">
              비밀번호를 잊으셨나요?
            </Link>
            <Link component={NextLink} href="/register" variant="body2">
              {'아직 회원이 아니신가요? 회원가입'}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
