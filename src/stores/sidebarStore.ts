import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  expandedMenus: string[]; // Set 대신 배열 사용 (JSON 직렬화 가능)
  activeMenu: string | null;
}

interface SidebarActions {
  toggleSidebar: () => void;
  toggleMenuGroup: (menuPath: string) => void;
  setActiveMenu: (menuPath: string) => void;
  resetExpandedMenus: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState & SidebarActions>()(
  persist(
    (set, get) => ({
      // 초기 상태 (localStorage에서 복원되므로 의미 없음)
      isOpen: false,
      expandedMenus: [],
      activeMenu: null,

      // 액션들
      toggleSidebar: () => {
        const { isOpen } = get();
        set({ isOpen: !isOpen });
      },

      setSidebarOpen: (open: boolean) => {
        set({ isOpen: open });
      },

      toggleMenuGroup: (menuPath: string) => {
        console.log('🔄 toggleMenuGroup 호출:', menuPath);
        console.log('📊 현재 expandedMenus:', get().expandedMenus);

        // null, undefined, 빈 문자열 체크
        if (!menuPath) {
          console.log('❌ menuPath가 유효하지 않음:', menuPath);
          return;
        }

        const { expandedMenus } = get();
        const newExpandedMenus = expandedMenus.includes(menuPath)
          ? expandedMenus.filter((path) => path !== menuPath)
          : [...expandedMenus, menuPath];

        console.log('✅ 새로운 expandedMenus:', newExpandedMenus);
        set({ expandedMenus: newExpandedMenus });
      },

      setActiveMenu: (menuPath: string) => {
        set({ activeMenu: menuPath });
      },

      resetExpandedMenus: () => {
        set({ expandedMenus: [] });
      },
    }),
    {
      name: 'sidebar-storage', // localStorage 키 이름
      // expandedMenus와 isOpen 모두 저장
      partialize: (state) => ({
        expandedMenus: state.expandedMenus,
        isOpen: state.isOpen,
      }),
      // 초기 상태를 localStorage에서 가져오기
      onRehydrateStorage: () => (state) => {
        if (state) {
          // localStorage에서 복원된 상태 사용
          console.log('🔄 localStorage에서 상태 복원:', state);
        }
      },
    },
  ),
);
