'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDialog } from '@/components/providers/DialogProvider';
import { registUser } from '@/actions/auth';
import { RegisterFormData } from '@/types/register';
import * as Yup from 'yup';

// 회원가입 유효성 검증 스키마
const registerSchema = Yup.object({
  userName: Yup.string()
    .min(2, '사용자명은 최소 2자 이상이어야 합니다.')
    .max(20, '사용자명은 최대 20자까지 가능합니다.')
    .matches(
      /^[a-zA-Z0-9가-힣_]+$/,
      '사용자명은 영문, 숫자, 한글, 언더스코어만 사용 가능합니다.',
    )
    .required('사용자명을 입력해 주세요.'),
  email: Yup.string()
    .email('올바른 이메일 형식을 입력해 주세요.')
    .required('이메일을 입력해 주세요.'),
  password: Yup.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '비밀번호는 영문 대소문자와 숫자를 포함해야 합니다.',
    )
    .required('비밀번호를 입력해 주세요.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호 확인을 입력해 주세요.'),
});

export default function RegisterPage() {
  const router = useRouter();
  const { showAlert } = useDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const result = await registUser(data);

      if (result.success) {
        // 성공 시
        await showAlert(
          '성공',
          '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.',
          {
            useSweetAlert: true,
          },
        );
        router.push('/login');
      } else {
        // 실패 시
        await showAlert('알림', result.message, {
          useSweetAlert: true,
        });
      }
    } catch (error: any) {
      // 예상치 못한 에러 처리
      await showAlert('알림', '회원가입 중 오류가 발생했습니다.', {
        useSweetAlert: true,
      });
    } finally {
      setIsLoading(false);
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
          회원가입
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="사용자명"
            {...register('userName')}
            error={!!errors.userName}
            helperText={errors.userName?.message}
            autoComplete="username"
            autoFocus
            variant="outlined"
            disabled={isLoading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일 주소"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
            type="email"
            variant="outlined"
            disabled={isLoading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            {...register('password')}
            label="비밀번호"
            type={showPassword ? 'text' : 'password'}
            id="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="new-password"
            variant="outlined"
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword((v) => !v)}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            {...register('confirmPassword')}
            label="비밀번호 확인"
            type={showConfirm ? 'text' : 'password'}
            id="confirmPassword"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            autoComplete="new-password"
            variant="outlined"
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowConfirm((v) => !v)}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              mt: 2,
            }}
          >
            <Typography variant="body2">
              이미 계정이 있으신가요?{' '}
              <Button
                onClick={() => router.push('/login')}
                sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
              >
                로그인
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
