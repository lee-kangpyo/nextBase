import { Button, Card, CardContent, Typography, Stack } from '@mui/material';
import { toast } from 'react-toastify';

export default function ToastCard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          토스트 메시지
        </Typography>
        <Stack spacing={1}>
          <Button fullWidth onClick={() => toast.success('성공')}>
            Success
          </Button>
          <Button fullWidth onClick={() => toast.error('실패')}>
            Error
          </Button>
          <Button fullWidth onClick={() => toast.warning('경고')}>
            Warning
          </Button>
          <Button fullWidth onClick={() => toast.info('정보')}>
            Info
          </Button>
          <Button fullWidth onClick={() => toast.dark('어두운 테마')}>
            Dark
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
