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
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
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
          disabled={isGoogleLoading || isNaverLoading}
          variant="outlined"
          fullWidth
          sx={{
            mb: 3,
            py: 1.5,
            borderColor: '#dadce0',
            color: '#3c4043',
            backgroundColor: '#ffffff',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              borderColor: '#dadce0',
            },
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 18,
              height: 18,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23FFC107' d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3Cpath fill='%23FF3D00' d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'/%3E%3Cpath fill='%234CAF50' d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'/%3E%3Cpath fill='%231976D2' d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3C/svg%3E\")",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            },
          }}
        >
          {isGoogleLoading ? '로그인 중...' : 'Google로 로그인'}
        </Button>

        {/* 네이버 로그인 버튼 */}
        <Button
          onClick={handleNaverLogin}
          disabled={isGoogleLoading || isNaverLoading}
          variant="outlined"
          fullWidth
          sx={{
            mb: 2,
            py: 1.5,
            borderColor: '#03c75a',
            color: '#ffffff',
            backgroundColor: '#03c75a',
            '&:hover': {
              backgroundColor: '#02b351',
              borderColor: '#02b351',
            },
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 18,
              height: 18,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23ffffff' d='M16.273 12.846L7.376 14.33l.318-2.196 8.897-1.484zM20.017 9.032l-9.468 1.578.239-1.652 9.468-1.578zM23.338 6.97l-10.789 1.798.159-1.105 10.789-1.798zM26.659 4.908l-12.11 2.018.08-.554 12.11-2.018zM30.4 1.094L13.77 3.112l.04-.277L30.44.817zM32.721-.968L15.091 1.05l.02-.138L32.741-1.106z'/%3E%3C/svg%3E\")",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            },
          }}
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
