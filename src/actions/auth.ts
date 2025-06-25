'use server';
import apiClient from '@/utils/apiClient';

const API_URL = '/auth';

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
