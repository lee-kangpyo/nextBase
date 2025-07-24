import { useApiClient } from '@/utils/apiClientServer';
import { useSession } from 'next-auth/react';
import { useDialog } from '@/components/providers/DialogProvider';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

/**
 * Tanstack Query 및 자동 토큰 갱신 예시
 *
 * const api = useApi();
 *
 * // GET 예시 (accessToken이 없거나 만료되어도 자동으로 401 처리 및 토큰 갱신/재요청)
 * const { data, isLoading, error } = useQuery({
 *   queryKey: ['admin-user-list', params],
 *   enabled: api.status === 'authenticated',
 *   queryFn: async () => {
 *     const res = await api.get('/admin/userList', params);
 *     return res.data;
 *   },
 * });
 *
 * // useMutation 예시 (POST, 자동 토큰 갱신/재요청)
 * const mutation = useMutation({
 *   mutationFn: (user) => api.post('/admin/user', user),
 *   onSuccess: () => { // 성공 시 처리 },
 * });
 *
 * // POST 예시
 * await api.post('/admin/user', { userName: '홍길동' });
 *
 * // PUT 예시
 * await api.put('/admin/user/1', { useYn: 'N' });
 *
 * // DELETE 예시
 * await api.del('/admin/user/1', { name: '홍길동' });
 *
 * // 파일 업로드 예시
 * await api.upload('/attach/upload', files, { extraKey: 'value' });
 *
 * // 파일 다운로드 예시
 * await api.download('/attach/download', { id: 1 });
 *
 * // 모든 API 함수는 accessToken이 undefined여도 401 발생 시 자동으로 토큰 갱신 및 재요청을 시도.
 */
export function useApi() {
  const { data: session, status, update } = useSession();
  const { showAlert } = useDialog();
  const accessToken = session?.accessToken;
  const router = useRouter();

  // 토큰 갱신 시도 - 성공 시 새로운 토큰 반환
  const tryRefreshToken = async (): Promise<string | null> => {
    try {
      // NextAuth의 update를 호출하여 토큰 갱신 시도
      const result = await update();
      // update()는 Session | null을 반환하므로 error 속성은 없음
      return result?.accessToken || null;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      return null;
    }
  };

  // 401 에러 처리 - 토큰 갱신 시도 후 재요청 또는 로그인 페이지 이동
  const handle401Error = async (
    retryRequest: (newAccessToken: string) => Promise<any>,
  ) => {
    const newAccessToken = await tryRefreshToken();
    if (newAccessToken) {
      // 갱신 성공 시 원래 요청 재시도
      return await retryRequest(newAccessToken);
    } else {
      // 갱신 실패 시 세션 만료 처리
      await showAlert('세션 만료', '로그인이 필요합니다.', {
        useSweetAlert: true,
        sweetAlertIcon: 'error',
      });
      router.replace('/login');
      throw new Error('세션이 만료되었습니다.');
    }
  };

  // 공통 요청 함수들
  const doGet = (
    token: string | undefined,
    url: string,
    params: any = {},
    config: any = {},
  ) =>
    useApiClient.get(url, {
      ...config,
      params,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

  const doDelete = (
    token: string | undefined,
    url: string,
    params: any = {},
    config: any = {},
  ) =>
    useApiClient.delete(url, {
      ...config,
      params,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

  const doPost = (
    token: string | undefined,
    url: string,
    data: any = {},
    config: any = {},
  ) =>
    useApiClient.post(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

  const doPut = (
    token: string | undefined,
    url: string,
    data: any = {},
    config: any = {},
  ) =>
    useApiClient.put(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

  const doUpload = (
    token: string | undefined,
    url: string,
    files: File[],
    extraData: Record<string, any> = {},
    config: any = {},
  ) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return useApiClient.post(url, formData, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const doDownload = (
    token: string | undefined,
    url: string,
    params: any = {},
    config: any = {},
  ) =>
    useApiClient.get(url, {
      ...config,
      params,
      responseType: 'blob',
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

  // 실제 API 함수들
  async function get(url: string, params: any = {}, config: any = {}) {
    try {
      return await doGet(accessToken, url, params, config);
    } catch (error: any) {
      if (error.response?.status === 401) {
        return await handle401Error((newAccessToken) =>
          doGet(newAccessToken, url, params, config),
        );
      }
      throw error;
    }
  }

  async function del(url: string, params: any = {}, config: any = {}) {
    try {
      return await doDelete(accessToken, url, params, config);
    } catch (error: any) {
      if (error.response?.status === 401) {
        return await handle401Error((newAccessToken) =>
          doDelete(newAccessToken, url, params, config),
        );
      }
      throw error;
    }
  }

  async function post(url: string, data: any = {}, config: any = {}) {
    try {
      return await doPost(accessToken, url, data, config);
    } catch (error: any) {
      if (error.response?.status === 401) {
        return await handle401Error((newAccessToken) =>
          doPost(newAccessToken, url, data, config),
        );
      }
      throw error;
    }
  }

  async function put(url: string, data: any = {}, config: any = {}) {
    try {
      return await doPut(accessToken, url, data, config);
    } catch (error: any) {
      if (error.response?.status === 401) {
        return await handle401Error((newAccessToken) =>
          doPut(newAccessToken, url, data, config),
        );
      }
      throw error;
    }
  }

  async function upload(
    url: string,
    files: File[],
    extraData: Record<string, any> = {},
    config: any = {},
  ) {
    try {
      return await doUpload(accessToken, url, files, extraData, config);
    } catch (error: any) {
      if (error.response?.status === 401) {
        return await handle401Error((newAccessToken) =>
          doUpload(newAccessToken, url, files, extraData, config),
        );
      }
      throw error;
    }
  }

  async function download(url: string, params: any = {}, config: any = {}) {
    try {
      return await doDownload(accessToken, url, params, config);
    } catch (error: any) {
      if (error.response?.status === 401) {
        return await handle401Error((newAccessToken) =>
          doDownload(newAccessToken, url, params, config),
        );
      }
      throw error;
    }
  }

  return { get, post, put, del, upload, download, status };
}
