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
    console.log('🔄 SessionGuard - 세션 상태 변경:', status);

    // 로딩 중이거나 이미 처리 중이면 무시
    if (status === 'loading' || isHandlingUnauthenticated.current) {
      console.log('⏳ SessionGuard - 로딩 중이거나 처리 중, 무시');
      return;
    }

    // 인증되지 않은 상태이고 아직 알림을 보여주지 않았다면
    if (status === 'unauthenticated' && !hasShownAlert.current) {
      console.log('🚨 SessionGuard - 인증되지 않은 상태 감지!');

      // 잠시 대기 후 다시 세션 상태 확인 (탭 전환으로 인한 일시적 상태 변화 방지)
      const timeoutId = setTimeout(() => {
        // 여전히 unauthenticated 상태인지 확인
        if (status === 'unauthenticated' && !hasShownAlert.current) {
          console.log('🚨 SessionGuard - 세션 만료 확인됨, 알림 표시');
          logger.info(
            '[SessionGuard] Unauthenticated status detected in client.',
          );
          isHandlingUnauthenticated.current = true;
          hasShownAlert.current = true;

          showAlert(
            '세션만료',
            '세션이 만료되었습니다. 다시 로그인 해주세요.',
            {
              useSweetAlert: true,
              sweetAlertIcon: 'error',
            },
          ).then(() => {
            router.push('/login');
          });
        } else {
          console.log('✅ SessionGuard - 세션 상태 복구됨, 알림 취소');
        }
      }, 1000); // 1초 대기

      // cleanup 함수
      return () => clearTimeout(timeoutId);
    }

    // 인증된 상태로 돌아오면 플래그 리셋
    if (status === 'authenticated') {
      console.log('✅ SessionGuard - 인증된 상태로 복구');
      isHandlingUnauthenticated.current = false;
      hasShownAlert.current = false;
    }
  }, [status, router, showAlert]);

  return children;
};
