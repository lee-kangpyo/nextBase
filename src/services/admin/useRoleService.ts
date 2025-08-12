import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';

export const useRoleService = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // 권한 목록 조회
  const roles = () =>
    useQuery({
      queryKey: ['roles'],
      enabled: api.status === 'authenticated',
      queryFn: async () => {
        const res = await api.get('/admin/roles');
        return res.data;
      },
    });

  // 권한 생성
  const createRole = useMutation({
    mutationFn: (data: { roleName: string; description: string }) =>
      api.post('/admin/roles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  // 권한 수정
  const updateRole = useMutation({
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

  // 권한 삭제
  const deleteRole = useMutation({
    mutationFn: (roleId: number) => api.del(`/admin/roles/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  return {
    // Queries
    roles,

    // Mutations
    createRole,
    updateRole,
    deleteRole,

    // Utils
    invalidateRoles: () =>
      queryClient.invalidateQueries({ queryKey: ['roles'] }),
  };
};
