import { TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../schema';
import React from 'react';

interface ResetPasswordFormProps {
  isLoading: boolean;
  onSubmit: (data: { password: string; confirmPassword: string }) => void;
}

export default function ResetPasswordForm({
  isLoading,
  onSubmit,
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="새 비밀번호"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message as string}
        fullWidth
        disabled={isLoading}
        margin="normal"
      />
      <TextField
        label="비밀번호 확인"
        type="password"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message as string}
        fullWidth
        disabled={isLoading}
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!isValid || isLoading}
        sx={{ mt: 1, py: 1.2, fontWeight: 700, fontSize: '1rem' }}
      >
        {isLoading ? '처리 중...' : '비밀번호 재설정'}
      </Button>
    </form>
  );
}
