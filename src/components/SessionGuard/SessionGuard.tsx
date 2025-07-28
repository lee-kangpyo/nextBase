'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDialog } from '../providers/DialogProvider';
import { logger } from '@/utils/logger';

export const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const { showAlert } = useDialog();
  const router = useRouter();
  const isHandlingUnauthenticated = useRef(false);
  const hasShownAlert = useRef(false);

  useEffect(() => {
    // 로딩 중이거나 이미 처리 중이면 무시
    if (status === 'loading' || isHandlingUnauthenticated.current) {
      return;
    }

    // 인증되지 않은 상태이고 아직 알림을 보여주지 않았다면
    if (status === 'unauthenticated' && !hasShownAlert.current) {
      logger.info('[SessionGuard] Unauthenticated status detected in client.');
      isHandlingUnauthenticated.current = true;
      hasShownAlert.current = true;

      showAlert('세션만료', '세션이 만료되었습니다. 다시 로그인 해주세요.', {
        useSweetAlert: true,
        sweetAlertIcon: 'error',
      }).then(() => {
        router.push('/login');
      });
    }

    // 인증된 상태로 돌아오면 플래그 리셋
    if (status === 'authenticated') {
      isHandlingUnauthenticated.current = false;
      hasShownAlert.current = false;
    }
  }, [status, router, showAlert]);

  return children;
};
