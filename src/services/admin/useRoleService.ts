import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { MenuResource } from '@/types/menu';
import { ROLE_API } from '@/constants/api';

export const useRoleService = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // 권한 목록 조회
  const roles = useQuery({
    queryKey: ['roles'],
    enabled: api.status === 'authenticated',
    queryFn: async () => {
      const res = await api.get(ROLE_API.LIST);
      return res.data;
    },
  });

  // 권한 생성
  const createRole = useMutation({
    mutationFn: (data: { roleName: string; description: string }) =>
      api.post(ROLE_API.CREATE, data),
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
    }) => api.post(ROLE_API.UPDATE(roleId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  // 권한 삭제
  const deleteRole = useMutation({
    mutationFn: (roleId: number) => api.post(ROLE_API.DELETE(roleId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  // 역할별 리소스 조회
  const useRoleResources = (roleId: number) => {
    return useQuery({
      queryKey: ['role-resources', roleId],
      enabled: api.status === 'authenticated' && roleId > 0,
      queryFn: async () => {
        const res = await api.get(ROLE_API.GET_RESOURCES(roleId));
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

  // 역할에 리소스 추가 (상위 그룹 자동 할당)
  const addRoleResource = useMutation({
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
        api.post(ROLE_API.ADD_RESOURCE(roleId, resId)),
      );

      await Promise.all(promises);

      return { roleId, resourceId, parentGroups: parentGroupIds };
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ['role-resources', roleId] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  // 역할에서 리소스 제거 (고아 그룹 자동 제거)
  const removeRoleResource = useMutation({
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
      await api.post(ROLE_API.DELETE_RESOURCE(roleId, resourceId));

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
            await api.post(
              ROLE_API.DELETE_RESOURCE(roleId, resource.parentResourceId),
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

  return {
    // Queries
    roles: () => roles,
    useRoleResources: (roleId: number) => useRoleResources(roleId),

    // Mutations
    createRole,
    updateRole,
    deleteRole,
    addRoleResource,
    removeRoleResource,

    // Utils
    invalidateRoles: () =>
      queryClient.invalidateQueries({ queryKey: ['roles'] }),
    findResource,
    findParentMenuIds,
  };
};
