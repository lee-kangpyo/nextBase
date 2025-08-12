import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';

export const useUserService = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // 관리자 사용자 목록 조회
  const adminUserList = () =>
    useQuery({
      queryKey: ['admin-user-list'],
      enabled: api.status === 'authenticated',
      queryFn: async () => {
        const res = await api.get('/admin/userList');
        return res.data;
      },
    });

  // 사용자에게 권한 추가
  const addUserRole = useMutation({
    mutationFn: ({ userName, roleId }: { userName: string; roleId: number }) =>
      api.post(`/admin/users/${userName}/roles/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });

  // 사용자 권한 제거
  const removeUserRole = useMutation({
    mutationFn: ({ userName, roleId }: { userName: string; roleId: number }) =>
      api.del(`/admin/users/${userName}/roles/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });

  // 사용자 활성화
  const activateUser = useMutation({
    mutationFn: (userName: string) =>
      api.put(`/admin/users/${userName}/activate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });

  // 사용자 비활성화
  const deactivateUser = useMutation({
    mutationFn: (userName: string) =>
      api.put(`/admin/users/${userName}/deactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });

  // 로그인 실패 횟수 초기화
  const resetLoginFailure = useMutation({
    mutationFn: (userName: string) =>
      api.put(`/admin/users/${userName}/reset-login-failure`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });

  return {
    // Queries
    adminUserList,

    // Mutations
    addUserRole,
    removeUserRole,
    activateUser,
    deactivateUser,
    resetLoginFailure,

    // Utils
    invalidateUserList: () =>
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] }),
  };
};
