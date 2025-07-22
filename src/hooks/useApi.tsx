import { useApiClient } from '@/utils/apiClientServer';
import { useSession } from 'next-auth/react';
import { useDialog } from '@/components/providers/DialogProvider';
import { useRouter } from 'next/navigation';

/**
 * Tanstack Query 사용 예시
  const api = useApi();
  const params = { page: 1, size: 10 };
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-user-list', params],
    enabled: api.status === 'authenticated',
    queryFn: async () => {
      const res = await api.get('/admin/userList', params);
      return res.data;
    },
  });
  또는 단독으로 사용시
  // POST
  const res = await api.post('/admin/user', { userName: '홍길동' });

  // PUT
  const res = await api.put('/admin/user/1', { useYn: 'N' });

  // DELETE (쿼리 파라미터)
  const res = await api.del('/admin/user/1', { name: '홍길동' });

  // GET (쿼리 파라미터)
  const res = await api.get('/admin/userList', { page: 1, size: 10 });
 */
export function useApi() {
  const { data: session, status } = useSession();
  const { showAlert } = useDialog();
  const accessToken = session?.accessToken;
  const router = useRouter();
  async function get(url: string, params: any = {}, config: any = {}) {
    try {
      return await useApiClient.get(url, {
        ...config,
        params,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        await showAlert('세션 만료', '로그인이 필요합니다.', {
          useSweetAlert: true,
          sweetAlertIcon: 'error',
        });
        router.replace('/login');
      }
      throw error;
    }
  }

  async function del(url: string, params: any = {}, config: any = {}) {
    try {
      return await useApiClient.delete(url, {
        ...config,
        params,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        await showAlert('세션 만료', '로그인이 필요합니다.', {
          useSweetAlert: true,
          sweetAlertIcon: 'error',
        });
        router.replace('/login');
      }
      throw error;
    }
  }

  async function post(url: string, data: any = {}, config: any = {}) {
    try {
      return await useApiClient.post(url, data, {
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        await showAlert('세션 만료', '로그인이 필요합니다.', {
          useSweetAlert: true,
          sweetAlertIcon: 'error',
        });
        router.replace('/login');
      }
      throw error;
    }
  }

  async function put(url: string, data: any = {}, config: any = {}) {
    try {
      return await useApiClient.put(url, data, {
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        await showAlert('세션 만료', '로그인이 필요합니다.', {
          useSweetAlert: true,
          sweetAlertIcon: 'error',
        });
        router.replace('/login');
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
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      return await useApiClient.post(url, formData, {
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        await showAlert('세션 만료', '로그인이 필요합니다.', {
          useSweetAlert: true,
          sweetAlertIcon: 'error',
        });
        router.replace('/login');
      }
      throw error;
    }
  }

  return { get, post, put, del, upload, status };
}
