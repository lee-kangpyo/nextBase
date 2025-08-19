import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 사이드바 상태 인터페이스
 * - 사이드바의 열림/닫힘, 메뉴 그룹 상태, 활성 메뉴를 관리
 */
interface SidebarState {
  isOpen: boolean; // 사이드바가 열려있는지 여부
  expandedMenus: string[]; // 현재 펼쳐진 메뉴 그룹들의 경로 배열
  activeMenu: string | null; // 현재 활성화된 메뉴의 경로
}

/**
 * 사이드바 액션 인터페이스
 * - 사이드바 상태를 변경하는 함수들을 정의
 */
interface SidebarActions {
  toggleSidebar: () => void; // 사이드바 열기/닫기 토글
  toggleMenuGroup: (menuPath: string) => void; // 특정 메뉴 그룹의 펼침/접힘 상태 토글
  setActiveMenu: (menuPath: string) => void; // 활성 메뉴 설정
  resetExpandedMenus: () => void; // 모든 펼쳐진 메뉴 그룹 초기화
  setSidebarOpen: (open: boolean) => void; // 사이드바 열기/닫기 상태 직접 설정
}

/**
 * 사이드바 상태 관리를 위한 Zustand 스토어
 * - 사이드바 열림/닫힘, 메뉴 그룹 펼침/접힘, 활성 메뉴 상태 관리
 * - localStorage를 통한 상태 지속성 제공
 */
export const useSidebarStore = create<SidebarState & SidebarActions>()(
  persist(
    (set, get) => ({
      // ===== 초기 상태 =====
      isOpen: false, // 사이드바 기본값: 닫힘
      expandedMenus: [], // 펼쳐진 메뉴 그룹: 없음
      activeMenu: null, // 활성 메뉴: 없음

      // ===== 사이드바 액션들 =====

      // 사이드바 열기/닫기 토글
      toggleSidebar: () => {
        const { isOpen } = get();
        set({ isOpen: !isOpen });
      },

      /**
       * 사이드바 열기/닫기 상태 직접 설정
       * @param open - true: 열기, false: 닫기
       */
      setSidebarOpen: (open: boolean) => {
        set({ isOpen: open });
      },

      /**
       * 특정 메뉴 그룹의 펼침/접힘 상태 토글
       * @param menuPath - 메뉴 경로 (예: '/admin', '/interface')
       */
      toggleMenuGroup: (menuPath: string) => {
        // ❌ menuPath가 유효하지 않음
        if (!menuPath) return;

        const { expandedMenus } = get();

        // ✅ 새로운 expandedMenus 생성
        const newExpandedMenus = expandedMenus.includes(menuPath)
          ? expandedMenus.filter((path) => path !== menuPath) // 이미 펼쳐져 있으면 접기
          : [...expandedMenus, menuPath]; // 접혀있으면 펼치기

        // ✅ expandedMenus 업데이트
        set({ expandedMenus: newExpandedMenus });
      },

      /**
       * 현재 활성화된 메뉴 설정
       * @param menuPath - 활성화할 메뉴 경로
       */
      setActiveMenu: (menuPath: string) => {
        set({ activeMenu: menuPath });
      },

      /**
       * 모든 펼쳐진 메뉴 그룹 초기화
       * 모든 메뉴 그룹을 접힌 상태로 변경
       */
      resetExpandedMenus: () => {
        set({ expandedMenus: [] });
      },
    }),
    {
      // ===== localStorage 설정 =====

      /** localStorage에 저장될 키 이름 */
      name: 'sidebar-storage',

      // localStorage에 expandedMenus와 isOpen만 저장 (activeMenu는 저장하지 않음)
      // set() 이 호출될때 persist 미들웨어에 의해 자동으로 호출됨.
      partialize: (state) => ({
        expandedMenus: state.expandedMenus, // 펼쳐진 메뉴 그룹 상태
        isOpen: state.isOpen, // 사이드바 열림/닫힘 상태
      }),

      // 페이지 새로고침 시 이전 상태를 복원
      // 복원 완료 후 자동 호출됨.
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('🔄 localStorage에서 사이드바 상태 복원:', state);
        }
      },
    },
  ),
);
