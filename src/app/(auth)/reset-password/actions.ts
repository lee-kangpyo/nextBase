'use server';

import { apiClientWithoutToken } from '@/utils/apiClientServer';
import { logger } from '@/utils/logger';
import { redirect } from 'next/navigation';

const API_URL = '/auth';

// 토큰 검증 서버 액션
export async function verifyResetToken(token: string) {
  try {
    if (!token) {
      return {
        success: false,
        message: '토큰이 필요합니다.',
      };
    }

    // 인증 없는 apiClient로 호출
    const response = await apiClientWithoutToken.get(
      `${API_URL}/validate-reset-token?token=${encodeURIComponent(token)}`,
    );

    if (response.status === 200) {
      return { success: true, message: response.data }; // 백엔드 메시지 사용
    }
    return {
      success: false,
      message: response.data || '알 수 없는 오류가 발생했습니다.',
    };
  } catch (error: any) {
    const message = error.response?.data || '서버 오류가 발생했습니다.';
    return { success: false, message };
  }
}

// 비밀번호 재설정 서버 액션
export async function resetPassword(token: string, password: string) {
  try {
    if (!token || !password) {
      return {
        success: false,
        message: '토큰과 비밀번호가 필요합니다.',
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: '비밀번호는 최소 8자 이상이어야 합니다.',
      };
    }

    const response = await apiClientWithoutToken.post(
      `${API_URL}/password/reset/confirm`,
      { token, newPassword: password },
    );

    // 임시로 성공한다고 가정
    logger.info(`Resetting password for token: ${token}`);

    return {
      success: true,
      message: response.data, // 백엔드 메시지 그대로 전달
    };
  } catch (error: any) {
    logger.error('Reset password error:', error);
    // 백엔드에서 보낸 메시지 추출
    const message =
      error.response?.data ||
      '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    return { success: false, message };
  }
}
