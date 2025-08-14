import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiContext } from '@/components/providers/ApiProvider';
import { MENU_API } from '@/constants/api';

export const useUserMenuService = () => {
  const api = useApiContext();
  const queryClient = useQueryClient();

  // 사용자별 메뉴 조회 (일반 사용자용)
  const userMenu = useQuery({
    queryKey: ['user-menu'],
    enabled: api.status === 'authenticated',
    queryFn: async () => {
      const res = await api.get(MENU_API.LIST);
      return res.data || [];
    },
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60 * 2, // 2시간
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    // Queries
    userMenu,

    // 캐시 무효화
    invalidateUserMenu: () =>
      queryClient.invalidateQueries({ queryKey: ['user-menu'] }),
  };
};
