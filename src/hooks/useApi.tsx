import { apiClientWithoutToken } from '@/utils/apiClientServer';
import { useSession } from 'next-auth/react';

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
  const accessToken = session?.accessToken;

  function get(url: string, params: any = {}, config: any = {}) {
    return apiClientWithoutToken.get(url, {
      ...config,
      params,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  function del(url: string, params: any = {}, config: any = {}) {
    return apiClientWithoutToken.delete(url, {
      ...config,
      params,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  function post(url: string, data: any = {}, config: any = {}) {
    return apiClientWithoutToken.post(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  function put(url: string, data: any = {}, config: any = {}) {
    return apiClientWithoutToken.put(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return { get, post, put, del, status };
}
