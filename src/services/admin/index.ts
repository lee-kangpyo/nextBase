/**
 * Admin 서비스 통합 export 파일
 *
 * 이 파일은 admin 폴더의 모든 서비스를 통합하여 export하는 중앙 집중식 진입점입니다.
 * 각 서비스는 기능별로 분리되어 있으며, 통합 훅을 통해 관련 기능들을 그룹화하여 제공합니다.
 *
 * @description
 * - useRoleService: 권한 관리 (생성, 수정, 삭제, 조회)
 * - useUserService: 사용자 관리 (목록, 권한 할당/제거, 활성화/비활성화)
 * - useResourceService: 메뉴 리소스 관리 (생성, 수정, 삭제, 조회)
 * - useRoleResourceService: 권한-리소스 매핑 (할당, 제거, 자동 그룹 관리)
 *
 * @example
 * // 권한 관리
 * import { useRoleService } from '@/services/admin';
 * const { roles, createRole, updateRole, deleteRole } = useRoleService();
 *
 * // 사용자 관리
 * import { useUserService } from '@/services/admin';
 * const { adminUserList, addUserRole, activateUser } = useUserService();
 *
 * // 리소스 관리
 * import { useResourceService } from '@/services/admin';
 * const { menuResources, createMenuResource } = useResourceService();
 *
 * // 권한-리소스 매핑
 * import { useRoleResourceService } from '@/services/admin';
 * const { useRoleResources, addRoleResource } = useRoleResourceService();
 */

// 권한 관리 서비스
export { useRoleService } from './useRoleService';

// 사용자 관리 서비스
export { useUserService } from './useUserService';

// 메뉴 리소스 관리 서비스
export { useResourceService } from './useResourceService';

// 권한-리소스 매핑 관리 서비스
export { useRoleResourceService } from './useRoleResourceService';
