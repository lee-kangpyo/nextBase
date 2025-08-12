import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { MenuResource, MenuResourceRequest } from '@/types/menu';
import { getSessionIdentifier } from '@/utils/identifier';

export const useResourceService = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // 메뉴 리소스 조회 (관리자용)
  const menuResources = () =>
    useQuery({
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

  // 사용자별 메뉴 조회 (일반 사용자용)
  const userMenu = () =>
    useQuery({
      queryKey: ['user-menu'], // 사용자별 캐싱
      enabled: api.status === 'authenticated',
      queryFn: async () => {
        const res = await api.get('/menu');
        return res.data || [];
      },
      // 메뉴 데이터 최적화 설정
      staleTime: 1000 * 60 * 30, // 30분 (메뉴는 자주 변경되지 않음)
      gcTime: 1000 * 60 * 60 * 2, // 2시간 (가비지 컬렉션 시간)
      refetchOnWindowFocus: false, // 윈도우 포커스 시 재호출 방지
      refetchOnMount: false, // 컴포넌트 마운트 시 재호출 방지
    });

  // 메뉴 리소스 생성
  const createMenuResource = useMutation({
    mutationFn: (data: MenuResourceRequest) =>
      api.post('/admin/resources/menu', data),
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
    }) => api.put(`/admin/resources/menu/${resourceId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] });
    },
  });

  // 메뉴 리소스 삭제
  const deleteMenuResource = useMutation({
    mutationFn: (resourceId: number) =>
      api.del(`/admin/resources/menu/${resourceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] });
    },
  });

  return {
    // Queries
    menuResources,
    userMenu,

    // Mutations
    createMenuResource,
    updateMenuResource,
    deleteMenuResource,

    // 캐시 무효화
    invalidateMenuResources: () =>
      queryClient.invalidateQueries({ queryKey: ['menu-resources'] }),
    invalidateUserMenu: () =>
      queryClient.invalidateQueries({ queryKey: ['user-menu'] }),
  };
};
