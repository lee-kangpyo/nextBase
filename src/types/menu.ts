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
