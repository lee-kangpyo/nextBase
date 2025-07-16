// pages/forgot-password.tsx
'use client';
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { resetPassword } from '@/actions/auth';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const [userName, setUserName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) throw new Error('아이디를 입력해주세요.');
    const res = await resetPassword(userName);
    if (res.ok) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h6" mb={2}>
        비밀번호 찾기
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="아이디"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth>
          비밀번호 찾기
        </Button>
      </form>
    </Box>
  );
}
