// src/app/login/page.tsx

'use client'; // 클라이언트 컴포넌트로 지정

import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Divider,
} from '@mui/material';
import NextLink from 'next/link'; // Next.js의 Link 컴포넌트를 MUI Link와 함께 사용
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/actions/auth';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import styles from './login.module.scss';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isNaverLoading, setIsNaverLoading] = useState(false);

  // URL 파라미터에서 에러 확인
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let errorMessage = '로그인 중 오류가 발생했습니다.';

      // NextAuth 에러 코드에 따른 메시지 설정
      switch (error) {
        case 'OAUTH_PARSE_PROFILE_ERROR':
          errorMessage =
            '소셜 로그인 처리 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.';
          break;
        case 'OAUTH_CALLBACK_ERROR':
          errorMessage = '소셜 로그인 콜백 처리 중 오류가 발생했습니다.';
          break;
        case 'OAUTH_CREATE_USER_ERROR':
          errorMessage = '사용자 계정 생성 중 오류가 발생했습니다.';
          break;
        case 'OAUTH_ACCOUNT_LINKING_ERROR':
          errorMessage = '계정 연동 중 오류가 발생했습니다.';
          break;
        case 'OAUTH_GET_PROFILE_ERROR':
          errorMessage = '사용자 정보를 가져오는 중 오류가 발생했습니다.';
          break;
        default:
          errorMessage = `로그인 오류: ${error}`;
      }

      toast.error(errorMessage);

      // 에러 파라미터 제거
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      router.replace(newUrl.pathname);
    }
  }, [searchParams, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const res = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
      if (!res?.ok) {
        toast.error(
          res?.error || '로그인에 실패했습니다. 잠시후 다시 시도해주세요.',
        );
        return;
      }
      router.push('/main');
    } catch (err: any) {
      toast.error(
        err?.message ||
          '로그인 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', {
        callbackUrl: '/main',
      });
    } catch (err: any) {
      toast.error(
        err?.message ||
          '구글 로그인 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleNaverLogin = async () => {
    setIsNaverLoading(true);
    try {
      await signIn('naver', {
        callbackUrl: '/main',
      });
    } catch (err: any) {
      toast.error(
        err?.message ||
          '네이버 로그인 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
      );
    } finally {
      setIsNaverLoading(false);
    }
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

        {/* 구글 로그인 버튼 */}
        <Button
          onClick={handleGoogleLogin}
          disabled={isSubmitting || isGoogleLoading || isNaverLoading}
          variant="outlined"
          fullWidth
          sx={{ mb: 3, py: 1.5 }}
          className={styles.googleButton}
        >
          {isGoogleLoading ? '로그인 중...' : 'Google로 로그인'}
        </Button>

        {/* 네이버 로그인 버튼 */}
        <Button
          onClick={handleNaverLogin}
          disabled={isSubmitting || isGoogleLoading || isNaverLoading}
          variant="outlined"
          fullWidth
          sx={{ mb: 2, py: 1.5 }}
          className={styles.naverButton}
        >
          {isNaverLoading ? '로그인 중...' : '네이버로 로그인'}
        </Button>

        {/* 구분선 */}
        <Divider sx={{ width: '100%', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            또는
          </Typography>
        </Divider>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: '100%' }}
          className={styles.textField}
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
            disabled={isSubmitting || isGoogleLoading || isNaverLoading}
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
            <Link component={NextLink} href="/forgot-password" variant="body2">
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
