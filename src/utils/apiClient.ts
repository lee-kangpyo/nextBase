import axios from 'axios';

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
  (config) => {
    // 로컬 스토리지에서 인증 토큰을 가져와 Authorization 헤더에 추가
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
    // 예시: 401 Unauthorized (인증 실패) 에러 발생 시 로그인 페이지로 리다이렉트
    // if (error.response && error.response.status === 401) {
    //   console.error('Authentication failed! Redirecting to login.');
    //   // window.location.href = '/login'; // 또는 Next.js useRouter 사용
    // }
    return Promise.reject(error);
  },
);

export default apiClient;
