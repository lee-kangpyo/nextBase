'use client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyResetToken, resetPassword } from './actions';
import React from 'react';
import ResetPasswordHeader from './component/ResetPasswordHeader';
import ResetPasswordMessage from './component/ResetPasswordMessage';
import ResetPasswordForm from './component/ResetPasswordForm';
import TokenVerifyingLoader from './component/TokenVerifyingLoader';
import Container from './component/ResetPasswordContainer';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // ➡️ 토큰 검증
  useEffect(() => {
    (async () => {
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
    })();
  }, [token]);

  // ➡️ 비밀번호 재설정 폼 제출
  const handleSubmitForm = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await resetPassword(token!, data.password);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // ➡️  토큰 검증 중 로딩 표시 렌더링
  if (isVerifying) {
    return <TokenVerifyingLoader />;
  }

  return (
    <Container>
      {/* ✅ 헤더 */}
      <ResetPasswordHeader isTokenValid={isTokenValid} />

      {/* ✅ 메시지 */}
      <ResetPasswordMessage
        error={error}
        success={success}
        onLoginRedirect={() => router.push('/login')}
      />

      {/* ✅ 비밀번호 재설정 폼 */}
      {isTokenValid && !success && (
        <ResetPasswordForm isLoading={isLoading} onSubmit={handleSubmitForm} />
      )}

      {/* ✅ 토큰이 유효하지 않거나 비밀번호 재설정이 성공하지 않은 경우 로그인 페이지로 이동 */}
      {!isTokenValid && !success && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ mt: 1, py: 1.2, fontWeight: 700, fontSize: '1rem' }}
          onClick={() => router.push('/login')}
        >
          로그인 페이지로 이동
        </Button>
      )}
    </Container>
  );
}
