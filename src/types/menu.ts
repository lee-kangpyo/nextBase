export interface MenuResource {
  resourceId: number;
  resourceType: 'MENU_ITEM' | 'API';
  resourcePattern: string;
  httpMethod: string | null;
  description: string;
  menuName: string;
  menuUrl: string;
  iconName: string;
  parentResourceId: number | null;
  displayOrder: number;
  isGroup: boolean;
  useYn: string; // 사용 여부 (Y: 사용, N: 미사용)
}

// 트리 구조의 메뉴 리소스 타입
export interface MenuResourceWithChildren extends MenuResource {
  children: MenuResourceWithChildren[];
  isOrphan?: boolean;
}

export interface MenuResourceRequest {
  resourcePattern: string;
  description?: string;
  menuName: string;
  menuUrl: string;
  iconName?: string;
  parentResourceId?: number | null;
  displayOrder?: number;
  isGroup?: boolean;
  useYn?: string; // 사용 여부 (Y: 사용, N: 미사용)
}

// 역할-리소스 매핑 관련 타입
export interface RoleResourceMapping {
  roleId: number;
  resourceId: number;
}

export interface RoleWithResources {
  roleId: number;
  roleName: string;
  description: string;
  resources: MenuResource[];
}

// 권한별 메뉴 조회 관련 타입
export interface RoleMenuRequest {
  roleIds: number[]; // 조회할 역할 ID 목록
}

export interface RoleMenuResponse {
  roleId: number;
  roleName: string;
  menuResources: MenuResourceWithChildren[]; // 계층 구조 메뉴
}

// 권한별 메뉴 조회 결과 (여러 역할의 합집합)
export interface RoleMenuUnionResponse {
  menuResources: MenuResourceWithChildren[]; // 합집합 처리된 메뉴
  roleCount: number; // 조회된 역할 수
  totalMenuCount: number; // 총 메뉴 수
}

interface MenuItem {
  id: number;
  name: string; // 메뉴 이름 (한국어)
  path: string; // 라우트 경로
  iconName: string; // 아이콘 이름 (Material-UI)
  isGroup: boolean; // 그룹 메뉴 여부
  parentResourceId?: number; // 부모 그룹 ID
  order: number; // 정렬 순서
  isActive: boolean; // 활성화 여부
}

interface UserMenu {
  menuItems: MenuItem[];
  userPermissions: string[]; // 사용자 권한 목록
}
