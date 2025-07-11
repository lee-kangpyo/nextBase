// src/app/login/page.tsx

'use client'; // 클라이언트 컴포넌트로 지정

import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
} from '@mui/material';
import NextLink from 'next/link'; // Next.js의 Link 컴포넌트를 MUI Link와 함께 사용
import { useRouter } from 'next/navigation';
import { login } from '@/actions/auth';
import { useState } from 'react';
import { useDialog } from '@/components/providers/DialogProvider';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const { showAlert } = useDialog();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
      router.push('/main');
    } catch (err: any) {
      await showAlert(
        '알림',
        err.message || '로그인에 실패했습니다. 잠시후 다시 시도해주세요.',
        {
          useSweetAlert: true,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
    // event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // const username = data.get('username') as string;
    // const password = data.get('password') as string;
    // authService
    //   .login(username, password)
    //   .then(async (res) => {
    //     console.log(res);
    //     await signIn('credentials', {
    //       redirect: false,
    //       username,
    //       password,
    //       accessToken: res.accessToken,
    //       refreshToken: res.refreshToken,
    //     });
    //     router.push('/main');
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
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
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
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
