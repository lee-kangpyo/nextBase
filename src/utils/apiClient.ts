import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AuthSession } from '@/types/auth';
import axios from 'axios';
import { getServerSession } from 'next-auth';

// 환경 변수 사용: 백엔드 API의 기본 URL을 설정합니다.
// .env.local 파일에 NEXT_PUBLIC_API_URL=http://localhost:8080/api 와 같이 추가하세요.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // 기본적으로 JSON 형식으로 통신
  },
  withCredentials: true, // 세션/쿠키 기반 인증 시 필요 (CORS 설정과 함께)
});

// 요청 인터셉터 - 모든 요청이 백엔드로 보내지기 전에 실행.
apiClient.interceptors.request.use(
  async (config) => {
    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (session && session.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 백엔드로부터 응답을 받은 후에 실행.
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 여기에 401 Unauthorized 에러 처리 로직 (토큰 갱신 및 재시도, 또는 로그아웃)
    // if (error.response?.status === 401 && !originalRequest._retry) { ... }
    return Promise.reject(error);
  },
);

export default apiClient;
