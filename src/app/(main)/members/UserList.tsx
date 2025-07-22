// src/app/main/UserList.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import { useApi } from '@/hooks/useApi';
import type { AxiosError } from 'axios';

export default function UserList() {
  const api = useApi();
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-user-list'],
    enabled: api.status === 'authenticated',
    queryFn: async () => {
      const res = await api.get('/admin/userList');
      return res.data;
    },
  });

  // 조건부 랜더링
  if (isLoading) return <CircularProgress />;

  if (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    let message = error.message;

    if (status === 403) {
      message = '권한이 없습니다.';
    } else if (status === 401) {
      message = '로그인이 필요합니다.';
    }
    // 필요시 다른 상태코드도 추가

    return <Alert severity="error">에러: {message}</Alert>;
  }
  if (!data || data.length === 0)
    return <Typography>유저가 없습니다.</Typography>;

  return (
    <List>
      {data.map((user: any) => (
        <ListItem key={user.userName} alignItems="flex-start">
          <ListItemText
            primary={
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography fontWeight="bold">{user.userName}</Typography>
                <Chip
                  label={user.useYn === 'Y' ? '활성' : '비활성'}
                  color={user.useYn === 'Y' ? 'success' : 'default'}
                  size="small"
                />
              </Stack>
            }
            secondary={
              <>
                <Typography
                  variant="body2"
                  component="span"
                  color="text.secondary"
                >
                  이메일: {user.email}
                </Typography>
                <Typography
                  variant="body2"
                  component="span"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  권한:{' '}
                  {user.roles && user.roles.length > 0
                    ? user.roles.map((role: string) => (
                        <Chip
                          key={role}
                          label={role}
                          color="primary"
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))
                    : '없음'}
                </Typography>
                <Typography
                  variant="body2"
                  component="span"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  로그인 실패: {user.loginFailureCount}회
                </Typography>
                <Typography
                  variant="body2"
                  component="span"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  마지막 실패:{' '}
                  {user.lastFailureTimestamp
                    ? new Date(user.lastFailureTimestamp).toLocaleString()
                    : '-'}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
