import { useMutation, useQuery } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { useDialog } from '@/components/providers/DialogProvider';

export function useAdminUserList() {
  const api = useApi();

  return useQuery({
    queryKey: ['admin-user-list'],
    enabled: api.status === 'authenticated',
    queryFn: async () => {
      const res = await api.get('/admin/userList');
      return res.data;
    },
  });
}

export const useRoles = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['roles'],
    enabled: api.status === 'authenticated',
    queryFn: async () => {
      const res = await api.get('/admin/roles');
      return res.data;
    },
  });
};

export const useCreateRole = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { roleName: string; description: string }) =>
      api.post('/admin/roles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRole = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      data,
    }: {
      roleId: number;
      data: { description: string };
    }) => api.put(`/admin/roles/${roleId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useDeleteRole = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: number) => api.del(`/admin/roles/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

// 사용자 권한 관리 훅들
export const useAddUserRole = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userName, roleId }: { userName: string; roleId: number }) =>
      api.post(`/admin/users/${userName}/roles/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });
};

export const useRemoveUserRole = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userName, roleId }: { userName: string; roleId: number }) =>
      api.del(`/admin/users/${userName}/roles/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });
};

// 사용자 활성화/비활성화 훅들
export const useActivateUser = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userName: string) =>
      api.put(`/admin/users/${userName}/activate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });
};

export const useDeactivateUser = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userName: string) =>
      api.put(`/admin/users/${userName}/deactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });
};

// 사용자 로그인 실패 횟수 초기화 훅
export const useResetLoginFailure = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userName: string) =>
      api.put(`/admin/users/${userName}/reset-login-failure`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-list'] });
    },
  });
};
