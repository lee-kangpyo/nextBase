import { Alert, Button } from '@mui/material';
import React from 'react';

interface ResetPasswordMessageProps {
  error: string | any;
  success: boolean;
  onLoginRedirect: () => void;
}

export default function ResetPasswordMessage({
  error,
  success,
  onLoginRedirect,
}: ResetPasswordMessageProps) {
  if (error) {
    return (
      <Alert severity="error">
        {typeof error === 'string'
          ? error
          : error?.detail || error?.message || JSON.stringify(error)}
      </Alert>
    );
  }

  if (success) {
    return (
      <>
        <Alert severity="success" sx={{ mb: 2 }}>
          비밀번호가 성공적으로 재설정되었습니다!
        </Alert>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onLoginRedirect}
        >
          로그인 페이지로 이동
        </Button>
      </>
    );
  }

  return null;
}
