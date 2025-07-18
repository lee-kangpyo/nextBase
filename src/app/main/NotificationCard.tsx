import { Button, Card, CardContent, Typography, Stack } from '@mui/material';
import { useDialog } from '@/components/providers/DialogProvider';

export default function NotificationCard() {
  const { showAlert, showConfirm } = useDialog();

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          알림/액션
        </Typography>
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={() =>
              showAlert('안녕하세요', '안녕하세요', {
                useSweetAlert: true,
              })
            }
          >
            Alert
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() =>
              showConfirm('정말 삭제하시겠습니까?', '정말 삭제하시겠습니까?', {
                useSweetAlert: true,
              })
            }
          >
            Confirm
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
