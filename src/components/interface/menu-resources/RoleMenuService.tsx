'use client';

import React, { useState } from 'react';
import { useRoleMenuService } from '@/services/admin';
import { RoleMenuUnionResponse } from '@/types/menu';

interface RoleMenuServiceProps {
  children: (props: {
    fetchMenuByRoles: (roleIds: number[]) => Promise<RoleMenuUnionResponse>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
  }) => React.ReactNode;
}

/**
 * 권한별 메뉴 조회를 위한 공통 서비스 로직을 제공하는 컴포넌트
 *
 * 이 컴포넌트는 useRoleMenuService 훅을 래핑하여
 * 권한별 메뉴 조회, 로딩 상태, 에러 처리 등의 공통 로직을 제공합니다.
 *
 * @example
 * <RoleMenuService>
 *   {({ fetchMenuByRoles, isLoading, error, clearError }) => (
 *     <div>
 *       {isLoading && <LoadingSpinner />}
 *       {error && <ErrorMessage error={error} onClear={clearError} />}
 *       <button onClick={() => fetchMenuByRoles([1, 2, 3])}>
 *         메뉴 조회
 *       </button>
 *     </div>
 *   )}
 * </RoleMenuService>
 */
export default function RoleMenuService({ children }: RoleMenuServiceProps) {
  const { fetchMenuByRoles } = useRoleMenuService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 에러 초기화
  const clearError = () => {
    setError(null);
  };

  // 권한별 메뉴 조회 (에러 처리 포함)
  const handleFetchMenuByRoles = async (
    roleIds: number[],
  ): Promise<RoleMenuUnionResponse> => {
    if (!roleIds || roleIds.length === 0) {
      throw new Error('권한을 선택해주세요.');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchMenuByRoles(roleIds);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '메뉴 데이터 조회에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {children({
        fetchMenuByRoles: handleFetchMenuByRoles,
        isLoading,
        error,
        clearError,
      })}
    </>
  );
}
