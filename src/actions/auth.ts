'use server';
import apiClient, { apiClientWithoutToken } from '@/utils/apiClient';
import { getToken } from 'next-auth/jwt';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
const API_URL = '/auth';

/**
 * 사용자 로그인을 처리하는 Server Action
 * - 스프링 백엔드에 로그인 요청을 보내 토큰 발급
 * - 이후 client에서 NextAuth.js 세션 생성
 * @param formData 로그인 폼 데이터
 * @returns 로그인 응답 데이터
 */
export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    throw new Error('사용자 이름과 비밀번호를 입력해주세요.');
  }
  console.log(`[Server Action] 로그인 요청 시작: ${username}`);

  try {
    console.log(`[Server Action] 스프링 백엔드에 로그인 요청: ${username}`);
    const res = await apiClient.post(`${API_URL}/login`, {
      userName: username,
      password: password,
    });
    console.log('[Server Action] 로그인 성공!');
    return res.data;
  } catch (error: any) {
    const message = error.response?.data || error.message;
    const errorMessage = message || '로그인 중 알 수 없는 오류 발생';
    console.error('[Server Action] 로그인 처리 중 오류:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * 사용자 로그아웃을 처리하는 Server Action
 * - 스프링 백엔드에 로그아웃 요청을 보내 토큰 무효화
 * - NextAuth.js 세션 제거
 * @param callbackUrl 로그아웃 후 리다이렉트할 URL (선택 사항) default: /login
 */
export async function logout(callbackUrl?: string) {
  const redirectTo = callbackUrl || '/login';
  try {
    console.log('[Server Action] 로그아웃 시작');
    try {
      // ✅ 스프링 백엔드 로그아웃 요청
      await apiClient.post(`${API_URL}/logout`);
      console.log(
        '[Server Action] 스프링 백엔드 로그아웃 요청 성공 (AccessToken 사용)',
      );
    } catch (backendError) {
      // 백엔드 로그아웃 실패는 치명적이지 않을 수 있으므로 경고만 로깅
      // (예: 이미 세션이 만료되어 AccessToken이 유효하지 않은 경우)
      console.warn(
        '[Server Action] 백엔드 로그아웃 실패 또는 AccessToken 유효하지 않음:',
        (backendError as any).response?.data || (backendError as any).message,
      );
    }

    // // ✅ **NextAuth.js 세션 제거**
    // //    NextAuth.js가 관리하는 JWT 세션 쿠키를 삭제하여 프론트엔드 로그인 상태를 해제
    // //    `redirect: false`로 설정하여 NextAuth.js의 자동 리다이렉트 막기.
    // await signOut({ redirect: false, callbackUrl: redirectTo });
    // console.log('[Server Action] NextAuth.js 세션 제거 완료');

    // // ✅ 로그아웃 후 지정된 URL로 리다이렉트
    // console.log(`[Server Action] 로그아웃 완료, ${redirectTo}로 리다이렉트`);
  } catch (error) {
    console.error('[Server Action] 로그아웃 중 예외 발생:', error);
    // throw error; // 로그아웃 실패를 던지는 방법도 있다.
  }
  // } finally {
  //   redirect(redirectTo);
  // }
}

// 토큰 재발급
export async function reissueToken(refreshToken: string) {
  //여기에 헤더 추가
  const res = await apiClientWithoutToken.post(
    `${API_URL}/token/reissue`,
    {},
    {
      headers: {
        'X-Refresh-Token': refreshToken,
        'Content-Type': 'application/json',
      },
    },
  );
  return res.data;
}

export async function getTest() {
  const res = await apiClient.get(`${API_URL}/helloWord/test`);
  return res.data;
}
