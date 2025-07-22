'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDialog } from '../providers/DialogProvider';
import { jwtDecode } from 'jwt-decode';
import { logger } from '@/utils/logger';

export const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const { showAlert } = useDialog();
  const router = useRouter();
  //   const intervalRef = useRef<NodeJS.Timeout | null>(null);
  //   const now = Math.floor(Date.now() / 1000);
  //   const payload = jwtDecode(session?.accessToken as string);
  const isHandlingUnauthenticated = useRef(false);

  useEffect(() => {
    (async () => {
      if (status === 'unauthenticated' && !isHandlingUnauthenticated.current) {
        logger.info(
          '[SessionGuard] Unauthenticated status detected in client.',
        );
        isHandlingUnauthenticated.current = true;
        await showAlert(
          '세션만료',
          '세션이 만료되었습니다. 다시 로그인 해주세요.',
          { useSweetAlert: true, sweetAlertIcon: 'error' },
        );
        router.push('/login');
      }
    })();
  }, [status, router]);

  return children;
};
