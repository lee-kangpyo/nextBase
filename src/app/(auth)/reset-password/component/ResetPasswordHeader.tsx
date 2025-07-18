import { Avatar, Typography, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface ResetPasswordHeaderProps {
  isTokenValid: boolean;
}

export default function ResetPasswordHeader({
  isTokenValid,
}: ResetPasswordHeaderProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 1 }}>
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
  );
}
