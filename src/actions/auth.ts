'use server';
import { RegisterFormData } from '@/types/register';
import {
  apiClientWithoutToken,
  apiClientServer,
} from '@/utils/apiClientServer';
import { logger } from '@/utils/logger';
import axios from 'axios';
import { cookies } from 'next/headers';
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
    return {
      success: false,
      message: '사용자 이름과 비밀번호를 입력해주세요.',
    };
  }
  logger.info(`[Server Action] 로그인 요청 시작: ${username}`);

  try {
    logger.info(`[Server Action] 스프링 백엔드에 로그인 요청: ${username}`);
    const res = await apiClientServer.post(`${API_URL}/login`, {
      userName: username,
      password: password,
    });

    // 1. Set-Cookie 헤더에서 refresh token 추출
    const setCookieHeader = res.headers['set-cookie'];
    let refreshToken: string | undefined = undefined;

    if (setCookieHeader) {
      // 여러 쿠키가 있을 수 있으니, X-Refresh-Token만 추출
      const match = setCookieHeader.find((cookie: string) =>
        cookie.startsWith('X-Refresh-Token='),
      );
      if (match) {
        refreshToken = match
          .split(';')[0] // 'X-Refresh-Token=...'
          .split('=')[1]; // 실제 토큰 값
      }
    }

    logger.info('[Server Action] 로그인 성공!');
    return {
      success: true,
      data: {
        ...res.data,
        refreshToken,
      },
    };
  } catch (error: any) {
    const message = error.response?.data || error.message;
    const errorMessage = message || '로그인 중 알 수 없는 오류 발생';
    logger.error('[Server Action] 로그인 처리 중 오류:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * 사용자 회원가입을 처리하는 Server Action
 * - 스프링 백엔드에 회원가입 요청을 보내 사용자 등록
 * - 기존 login 함수와 동일한 패턴 사용
 * @param formData 회원가입 폼 데이터
 * @returns 회원가입 응답 데이터
 */
export async function registUser(formData: RegisterFormData) {
  const userName = formData.userName;
  const email = formData.email;
  const password = formData.password;

  // 필수 필드 검증
  if (!userName || !email || !password) {
    return {
      success: false,
      message: '사용자명, 이메일, 비밀번호를 모두 입력해주세요.',
    };
  }

  // 이메일 형식 검증
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: '올바른 이메일 형식을 입력해주세요.',
    };
  }

  // 비밀번호 길이 검증
  if (password.length < 8) {
    return {
      success: false,
      message: '비밀번호는 8자 이상이어야 합니다.',
    };
  }

  logger.info(`[Server Action] 회원가입 요청 시작: ${userName} (${email})`);

  try {
    logger.info(`[Server Action] 스프링 백엔드에 회원가입 요청: ${userName}`);
    const res = await apiClientWithoutToken.post(`${API_URL}/register`, {
      userName,
      email,
      password,
    });
    logger.info('[Server Action] 회원가입 성공!');
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    const message = error.response?.data || error.message;
    const errorMessage = message || '회원가입 중 알 수 없는 오류 발생';
    logger.error('[Server Action] 회원가입 처리 중 오류:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
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
    logger.info('[Server Action] 로그아웃 시작');
    try {
      // ✅ 스프링 백엔드 로그아웃 요청
      await apiClientServer.post(`${API_URL}/logout`);
      logger.info(
        '[Server Action] 스프링 백엔드 로그아웃 요청 성공 (AccessToken 사용)',
      );
    } catch (backendError) {
      // 백엔드 로그아웃 실패는 치명적이지 않을 수 있으므로 경고만 로깅
      // (예: 이미 세션이 만료되어 AccessToken이 유효하지 않은 경우)
      logger.warn(
        '[Server Action] 백엔드 로그아웃 실패 또는 AccessToken 유효하지 않음:',
        (backendError as any).response?.data || (backendError as any).message,
      );
    }
  } catch (error) {
    logger.error('[Server Action] 로그아웃 중 예외 발생:', error);
    // throw error; // 로그아웃 실패를 던지는 방법도 있다.
  }
}

// 토큰 재발급
export async function reissueToken(refreshToken: string) {
  logger.info('[Server Action] 토큰 재발급 시작');
  try {
    const res = await apiClientWithoutToken.post(
      `${API_URL}/token/reissue`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `X-Refresh-Token=${refreshToken}`,
        },
      },
    );
    logger.info('[Server Action] 토큰 재발급 성공');
    return {
      ...res.data,
      refreshToken: res.headers['set-cookie']
        ?.find((cookie: string) => cookie.startsWith('X-Refresh-Token='))
        ?.split(';')[0]
        .split('=')[1],
    };
  } catch (error: any) {
    logger.error(
      '[Server Action] 토큰 재발급 실패:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function getTest() {
  const res = await apiClientServer.get(`${API_URL}/helloWord/test`);
  return res.data;
}

// 비밀번호 재설정
export async function resetPassword(userId: string) {
  try {
    const res = await apiClientServer.post(
      `${API_URL}/password/reset/request`,
      {
        userId,
      },
    );
    // 성공 시
    return {
      ok: true,
      message: res.data.message || '비밀번호 재설정 요청이 성공했습니다.',
    };
  } catch (error: any) {
    console.error('비밀번호 재설정 오류 (서버 액션 내부):', error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      let message = '알 수 없는 오류가 발생했습니다.';

      if (status === 404) {
        message = '해당하는 사용자를 찾을 수 없습니다.';
      } else if (status === 400) {
        message = error.response.data.message || '잘못된 요청입니다.';
      } else if (status >= 500) {
        message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }
      if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      }

      return { ok: false, message, status };
    } else {
      return {
        ok: false,
        message: '알 수 없는 오류가 발생했습니다.',
      };
    }
  }
}
