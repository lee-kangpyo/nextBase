import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiContext } from '@/components/providers/ApiProvider';
import { MenuResource, MenuResourceRequest } from '@/types/menu';
import { MENU_RESOURCE_API } from '@/constants/api';

export const useMenuResourceService = () => {
  const api = useApiContext();
  const queryClient = useQueryClient();

  // 메뉴 리소스 조회 (관리자용)
  const menuResources = useQuery({
    queryKey: ['menu-resources'],
    enabled: api.status === 'authenticated',
    queryFn: async () => {
      const res = await api.get(MENU_RESOURCE_API.LIST);
      return res.data.filter(
        (resource: MenuResource) => resource.resourceType === 'MENU_ITEM',
      ) as MenuResource[];
    },
  });

  // 메뉴 리소스 생성
  const createMenuResource = useMutation({
    mutationFn: (data: MenuResourceRequest) =>
      api.post(MENU_RESOURCE_API.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] });
    },
  });

  // 메뉴 리소스 수정
  const updateMenuResource = useMutation({
    mutationFn: ({
      resourceId,
      data,
    }: {
      resourceId: number;
      data: MenuResourceRequest;
    }) => api.post(MENU_RESOURCE_API.UPDATE(resourceId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] });
    },
  });

  // 메뉴 리소스 삭제
  const deleteMenuResource = useMutation({
    mutationFn: (resourceId: number) =>
      api.post(MENU_RESOURCE_API.DELETE(resourceId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] });
    },
  });

  return {
    // Queries
    menuResources: () => menuResources,

    // Mutations
    createMenuResource,
    updateMenuResource,
    deleteMenuResource,

    // 캐시 무효화
    invalidateMenuResources: () =>
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] }),
  };
};
