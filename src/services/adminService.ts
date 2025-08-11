import { useMutation, useQuery } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { useDialog } from '@/components/providers/DialogProvider';
import {
  MenuResource,
  MenuResourceRequest,
  RoleWithResources,
} from '@/types/menu';

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

// 메뉴 리소스 관리 훅들 (메뉴 리소스만)
export const useMenuResources = () => {
  const api = useApi();
  return useQuery({
    queryKey: ['menu-resources'],
    enabled: api.status === 'authenticated',
    queryFn: async () => {
      const res = await api.get('/admin/resources/menu');
      // MENU_ITEM만 필터링 (그룹 포함)
      return res.data.filter(
        (resource: MenuResource) => resource.resourceType === 'MENU_ITEM',
      ) as MenuResource[];
    },
  });
};

export const useCreateMenuResource = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MenuResourceRequest) =>
      api.post('/admin/resources/menu', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] });
    },
  });
};

export const useUpdateMenuResource = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resourceId,
      data,
    }: {
      resourceId: number;
      data: MenuResourceRequest;
    }) => api.put(`/admin/resources/menu/${resourceId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] });
    },
  });
};

export const useDeleteMenuResource = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: number) =>
      api.del(`/admin/resources/menu/${resourceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] });
    },
  });
};

// 역할-리소스 매핑 관리 훅들
export const useRoleResources = (roleId: number) => {
  const api = useApi();
  return useQuery({
    queryKey: ['role-resources', roleId],
    enabled: api.status === 'authenticated' && roleId > 0,
    queryFn: async () => {
      const res = await api.get(`/admin/roles/${roleId}/resources`);
      return res.data.filter(
        (resource: MenuResource) => resource.resourceType === 'MENU_ITEM',
      ) as MenuResource[];
    },
  });
};

// 리소스 리스트에서 리소스 찾기
const findResource = (resourceId: number, allResources: MenuResource[]) => {
  return allResources.find((r) => r.resourceId === resourceId);
};

// 리소스 아이디에 해당하는 부모 리소스 id들을 반환
const findParentMenuIds = (
  resourceId: number,
  allResources: MenuResource[],
) => {
  const parentIds: number[] = [];
  let resource = findResource(resourceId, allResources);

  while (resource?.parentResourceId) {
    parentIds.push(resource.parentResourceId);
    resource = findResource(resource.parentResourceId, allResources);
  }

  return parentIds;
};

export const useAddRoleResource = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      resourceId,
    }: {
      roleId: number;
      resourceId: number;
    }) => {
      // 1. 캐시에서 메뉴 리소스 가져오기
      const allResources = queryClient.getQueryData([
        'menu-resources',
      ]) as MenuResource[];

      // null 방어코드
      if (!allResources?.length) {
        throw new Error('메뉴 리소스를 불러올 수 없습니다. 다시 시도해주세요.');
      }

      // 현재 권한에 할당된 리소스 가져오기
      const currentRoleResources =
        (queryClient.getQueryData([
          'role-resources',
          roleId,
        ]) as MenuResource[]) || [];
      const currentResourceIds = currentRoleResources.map((r) => r.resourceId);

      // 2. 상위 그룹들 찾기
      const parentGroupIds = findParentMenuIds(resourceId, allResources);

      // 3. 선택한 리소스 + 상위 그룹들 모두 할당
      const resourcesToAdd = [resourceId, ...parentGroupIds];
      const uniqueResources = resourcesToAdd.filter(
        (id) => !currentResourceIds.includes(id),
      );

      // 5. 할당할 리소스가 없으면 성공으로 처리
      if (uniqueResources.length === 0) {
        return {
          roleId,
          resourceId,
          parentGroups: parentGroupIds,
          message: '이미 모든 리소스가 할당되어 있습니다.',
        };
      }

      // 6. 새로운 리소스들만 할당
      const promises = uniqueResources.map((resId) =>
        api.post(`/admin/roles/${roleId}/resources/${resId}`),
      );

      await Promise.all(promises);

      return { roleId, resourceId, parentGroups: parentGroupIds };
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ['role-resources', roleId] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useRemoveRoleResource = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      resourceId,
    }: {
      roleId: number;
      resourceId: number;
    }) => {
      // 1. 모든 리소스와 현재 권한 리소스 가져오기
      const allResources = queryClient.getQueryData([
        'menu-resources',
      ]) as MenuResource[];
      const currentRoleResources =
        (queryClient.getQueryData([
          'role-resources',
          roleId,
        ]) as MenuResource[]) || [];

      const resource = allResources.find((r) => r.resourceId === resourceId);
      if (!resource) throw new Error('리소스를 찾을 수 없습니다.');

      // 2. 실제 리소스 삭제
      await api.del(`/admin/roles/${roleId}/resources/${resourceId}`);

      // 3. 상위 그룹 정리 (중요!)
      if (resource.parentResourceId) {
        const parentGroup = allResources.find(
          (r) => r.resourceId === resource.parentResourceId,
        );

        if (parentGroup && parentGroup.isGroup) {
          // 같은 부모를 가진 다른 형제들이 현재 권한에 할당되어 있는지 확인
          const siblings = allResources.filter(
            (r) =>
              r.parentResourceId === resource.parentResourceId &&
              r.resourceId !== resourceId,
          );

          const siblingIds = siblings.map((r) => r.resourceId);
          const hasAssignedSiblings = siblingIds.some((id) =>
            currentRoleResources.some((r) => r.resourceId === id),
          );

          // 형제가 없으면 상위 그룹도 삭제
          if (!hasAssignedSiblings) {
            await api.del(
              `/admin/roles/${roleId}/resources/${resource.parentResourceId}`,
            );
          }
        }
      }
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ['role-resources', roleId] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};
