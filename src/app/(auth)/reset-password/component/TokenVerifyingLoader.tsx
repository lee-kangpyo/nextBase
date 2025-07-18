import { CircularProgress, Typography, Box } from '@mui/material';
import Container from './ResetPasswordContainer';

export default function TokenVerifyingLoader() {
  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CircularProgress />
        <Typography>토큰을 검증하는 중...</Typography>
      </Box>
    </Container>
  );
}
