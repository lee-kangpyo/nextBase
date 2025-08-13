'use client';

import { createContext, useContext, useMemo } from 'react';
import { useApi } from '@/hooks/useApi';

// ApiContext 타입 정의
const ApiContext = createContext<ReturnType<typeof useApi> | null>(null);

// ApiProvider 컴포넌트
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const api = useApi();

  // api 객체를 메모이제이션하여 불필요한 리렌더링 방지
  const memoizedApi = useMemo(() => api, [api]);

  return (
    <ApiContext.Provider value={memoizedApi}>{children}</ApiContext.Provider>
  );
};

// Context 사용을 위한 커스텀 훅
export const useApiContext = () => {
  const api = useContext(ApiContext);
  if (!api) {
    throw new Error('useApiContext must be used within ApiProvider');
  }
  return api;
};
