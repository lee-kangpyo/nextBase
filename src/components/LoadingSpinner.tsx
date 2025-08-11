import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({
  size = 'medium',
  fullScreen = false,
  message,
}: LoadingSpinnerProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };

  const spinner = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <CircularProgress size={getSize()} />
      {message && (
        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          {message}
        </Box>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          p: 3,
        }}
      >
        {spinner}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      {spinner}
    </Box>
  );
}

// 백그라운드 업데이트용 작은 스피너
export function BackgroundSpinner() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 150,
        right: 32,
        zIndex: 10000,
      }}
    >
      <CircularProgress size={20} color="primary" />
    </Box>
  );
}
