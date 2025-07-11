'use client';
import { Button } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useDialog } from '@/components/providers/DialogProvider';
import { toast } from 'react-toastify';
import { logout } from '@/actions/auth';
export default function MainPage() {
  const { showAlert, showConfirm } = useDialog();
  const session = useSession();
  console.log(session);
  return (
    <div>
      <div>MainPage</div>
      <Button
        onClick={() =>
          showAlert('안녕하세요', '안녕하세요', {
            useSweetAlert: true,
          })
        }
      >
        Alert
      </Button>
      <Button
        onClick={() =>
          showConfirm('정말 삭제하시겠습니까?', '정말 삭제하시겠습니까?', {
            useSweetAlert: true,
          })
        }
      >
        Confirm
      </Button>
      <Button onClick={() => toast.success('성공')}>Success</Button>
      <Button onClick={() => toast.error('실패')}>Error</Button>
      <Button onClick={() => toast.warning('경고')}>Warning</Button>
      <Button onClick={() => toast.info('정보')}>Info</Button>
      <Button onClick={() => toast.dark('어두운 테마')}>Dark</Button>
      <Button
        onClick={async () => {
          await logout(); // 백엔드 세션/토큰 무효화
          signOut({ callbackUrl: '/login' });
        }}
      >
        로그아웃
      </Button>
    </div>
  );
}
