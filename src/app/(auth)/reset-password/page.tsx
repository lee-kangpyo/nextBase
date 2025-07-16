'use client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyResetToken, resetPassword } from './actions';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // 토큰 검증
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setError('유효하지 않은 비밀번호 재설정 링크입니다.');
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyResetToken(token);

        if (result.success) {
          setIsTokenValid(true);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError('토큰 검증 중 오류가 발생했습니다.');
      } finally {
        setIsVerifying(false);
      }
    }

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('토큰이 없습니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await resetPassword(token, password);

      if (result.success) {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    password &&
    confirmPassword &&
    password === confirmPassword &&
    password.length >= 8;

  // 토큰 검증 중 로딩 표시
  if (isVerifying) {
    return (
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
              <CircularProgress />
              <Typography>토큰을 검증하는 중...</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f2f5"
      px={2}
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
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar
              sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 1 }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight={700} mb={0.5}>
              비밀번호 재설정
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={1.5}
              textAlign="center"
            >
              {isTokenValid
                ? '새 비밀번호를 입력해 주세요.'
                : '토큰이 유효하지 않습니다.'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              비밀번호가 성공적으로 재설정되었습니다!
            </Alert>
          )}

          {isTokenValid && !success && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <TextField
                label="새 비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                autoComplete="new-password"
                variant="outlined"
                size="medium"
                disabled={isLoading}
              />
              <TextField
                label="비밀번호 확인"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                autoComplete="new-password"
                variant="outlined"
                size="medium"
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 1, py: 1.2, fontWeight: 700, fontSize: '1rem' }}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? '처리 중...' : '비밀번호 재설정'}
              </Button>
            </Box>
          )}

          {!isTokenValid && !success && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 1, py: 1.2, fontWeight: 700, fontSize: '1rem' }}
              onClick={() => (window.location.href = '/')}
            >
              홈으로 이동
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
