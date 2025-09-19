/**
 * Admin 서비스 통합 export 파일
 *
 * 이 파일은 admin 폴더의 모든 서비스를 통합하여 export하는 중앙 집중식 진입점입니다.
 * 각 서비스는 기능별로 분리되어 있으며, 통합 훅을 통해 관련 기능들을 그룹화하여 제공합니다.
 *
 * @description
 * - useRoleService: 권한 관리 (생성, 수정, 삭제, 조회) + 권한-리소스 매핑
 * - useUserService: 사용자 관리 (목록, 권한 할당/제거, 활성화/비활성화)
 * - useMenuResourceService: 메뉴 리소스 관리 (생성, 수정, 삭제, 조회)
 *
 * @example
 * // 권한 관리 + 권한-리소스 매핑
 * import { useRoleService } from '@/services/admin';
 * const { roles, createRole, useRoleResources, addRoleResource } = useRoleService();
 *
 * // 사용자 관리
 * import { useUserService } from '@/services/admin';
 * const { adminUserList, addUserRole, activateUser } = useUserService();
 *
 * // 메뉴 리소스 관리
 * import { useMenuResourceService } from '@/services/admin';
 * const { menuResources, createMenuResource } = useMenuResourceService();
 */

// 권한 관리 서비스 (권한-리소스 매핑 포함)
export { useRoleService } from './useRoleService';

// 사용자 관리 서비스
export { useUserService } from './useUserService';

// 메뉴 리소스 관리 서비스
export { useMenuResourceService } from './useMenuResourceService';

// 권한별 메뉴 조회 서비스
export { useRoleMenuService } from './useRoleMenuService';
