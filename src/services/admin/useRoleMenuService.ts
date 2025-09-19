import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiContext } from '@/components/providers/ApiProvider';
import {
  RoleMenuRequest,
  RoleMenuResponse,
  RoleMenuUnionResponse,
  MenuResourceWithChildren,
} from '@/types/menu';
import { MENU_API } from '@/constants/api';

export const useRoleMenuService = () => {
  const api = useApiContext();
  const queryClient = useQueryClient();

  // 권한별 메뉴 조회 (여러 역할의 합집합)
  const roleMenuResources = useQuery({
    queryKey: ['role-menu-resources'],
    enabled: api.status === 'authenticated',
    queryFn: async (): Promise<RoleMenuUnionResponse> => {
      // 기본적으로 모든 메뉴를 반환 (권한이 선택되지 않은 경우)
      const res = await api.get(MENU_API.LIST);
      const allMenuResources = res.data.filter(
        (resource: any) => resource.resourceType === 'MENU_ITEM',
      ) as MenuResourceWithChildren[];

      return {
        menuResources: allMenuResources,
        roleCount: 0,
        totalMenuCount: allMenuResources.length,
      };
    },
  });

  // 특정 역할들의 메뉴 조회 (roleIds를 받아서 호출)
  const getMenuByRolesWithIds = (roleIds: number[]) => {
    return useQuery({
      queryKey: ['menu-by-roles', roleIds],
      enabled: api.status === 'authenticated' && roleIds.length > 0,
      queryFn: async (): Promise<RoleMenuUnionResponse> => {
        if (!roleIds || roleIds.length === 0) {
          // 역할이 선택되지 않은 경우 모든 메뉴 반환
          const res = await api.get(MENU_API.LIST);
          const allMenuResources = res.data.filter(
            (resource: any) => resource.resourceType === 'MENU_ITEM',
          ) as MenuResourceWithChildren[];

          return {
            menuResources: allMenuResources,
            roleCount: 0,
            totalMenuCount: allMenuResources.length,
          };
        }

        // 권한별 메뉴 조회 API 호출
        const queryParams = roleIds.map((id) => `roleIds=${id}`).join('&');
        const res = await api.get(`${MENU_API.BY_ROLES}?${queryParams}`);

        console.log('Role menu API response:', res.data); // 디버깅용 로그

        // 백엔드에서 합집합 처리가 완료된 메뉴 데이터 반환
        const menuResources = res.data.menuResources || res.data || [];

        return {
          menuResources: menuResources,
          roleCount: roleIds.length,
          totalMenuCount: menuResources.length,
        };
      },
    });
  };

  // 권한별 메뉴 조회 (실제 API 호출)
  const fetchMenuByRoles = async (
    roleIds: number[],
  ): Promise<RoleMenuUnionResponse> => {
    if (!roleIds || roleIds.length === 0) {
      // 역할이 선택되지 않은 경우 모든 메뉴 반환
      const res = await api.get(MENU_API.LIST);
      const allMenuResources = res.data.filter(
        (resource: any) => resource.resourceType === 'MENU_ITEM',
      ) as MenuResourceWithChildren[];

      return {
        menuResources: allMenuResources,
        roleCount: 0,
        totalMenuCount: allMenuResources.length,
      };
    }

    // 권한별 메뉴 조회 API 호출
    const queryParams = roleIds.map((id) => `roleIds=${id}`).join('&');
    const res = await api.get(`${MENU_API.BY_ROLES}?${queryParams}`);

    console.log('Role menu API response:', res.data); // 디버깅용 로그

    // 백엔드에서 합집합 처리가 완료된 메뉴 데이터 반환
    const menuResources = res.data.menuResources || res.data || [];

    return {
      menuResources: menuResources,
      roleCount: roleIds.length,
      totalMenuCount: menuResources.length,
    };
  };

  // 권한별 메뉴 조회 결과 캐시 무효화
  const invalidateRoleMenuResources = () => {
    queryClient.invalidateQueries({ queryKey: ['role-menu-resources'] });
    queryClient.invalidateQueries({ queryKey: ['menu-by-roles'] });
  };

  return {
    // Queries
    roleMenuResources: () => roleMenuResources,
    getMenuByRoles: getMenuByRolesWithIds,

    // Functions
    fetchMenuByRoles,

    // Cache invalidation
    invalidateRoleMenuResources,
  };
};
