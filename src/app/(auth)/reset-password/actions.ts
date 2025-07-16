'use server';

import apiClient, { apiClientWithoutToken } from '@/utils/apiClient';
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
      return { success: true, message: '토큰이 유효합니다.' };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { success: false, message: '유효하지 않은 토큰입니다.' };
    }
    if (error.response?.status === 410) {
      return { success: false, message: '만료된 토큰입니다.' };
    }
    return { success: false, message: '서버 오류가 발생했습니다.' };
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

    // TODO: 스프링 백엔드에 비밀번호 재설정 요청
    // const response = await fetch('http://spring-backend/auth/reset-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token, password })
    // });

    // 임시로 성공한다고 가정
    console.log(`Resetting password for token: ${token}`);

    return {
      success: true,
      message: '비밀번호가 성공적으로 재설정되었습니다.',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      message: '서버 오류가 발생했습니다.',
    };
  }
}
