import { AuthSession } from '@/types/auth';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from 'next-auth';

// 환경 변수 사용: 백엔드 API의 기본 URL을 설정합니다.
// .env.local 파일에 NEXT_PUBLIC_API_URL=http://localhost:8080/api 와 같이 추가하세요.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// server 용 apiClient
export const apiClientServer = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // 기본적으로 JSON 형식으로 통신
  },
  withCredentials: true, // 세션/쿠키 기반 인증 시 필요 (CORS 설정과 함께)
});

// 액세스 토큰 없이 호출 client/server 사용가능
export const apiClientWithoutToken = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// useApi 사용시 사용
export const useApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터 - 모든 요청이 백엔드로 보내지기 전에 실행.
apiClientServer.interceptors.request.use(
  async (config) => {
    // authOptions를 직접 정의하여 사용
    const authOptions: NextAuthOptions = {
      providers: [], // 빈 배열로 초기화 (실제 사용되지 않음)
      secret: process.env.NEXTAUTH_SECRET,
    };

    const session = (await getServerSession(authOptions)) as AuthSession | null;
    if (session && session.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('apiClient 인터셉터 request error', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 백엔드로부터 응답을 받은 후에 실행.
apiClientServer.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('apiClient 인터셉터 response error', error);
    return Promise.reject(error);
  },
);
