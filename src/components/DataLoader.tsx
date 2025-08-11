import { ReactNode } from 'react';
import LoadingSpinner, { BackgroundSpinner } from './LoadingSpinner';
import { Box, Typography } from '@mui/material';

interface DataLoaderProps {
  isLoading: boolean;
  isFetching: boolean;
  isEnabled: boolean;
  data?: any; // 데이터 존재 여부 확인용
  loadingMessage?: string;
  showBackgroundSpinner?: boolean;
  children: ReactNode;
}

export default function DataLoader({
  isLoading,
  isFetching,
  isEnabled,
  data,
  loadingMessage = '데이터를 불러오는 중...',
  showBackgroundSpinner = false,
  children,
}: DataLoaderProps) {
  // 스마트 로딩: 첫 로딩이거나 데이터가 없을 때만 로딩 표시
  if (!data || isLoading || !isEnabled) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  return (
    <>
      {children}
      {/* 백그라운드 업데이트 표시 (선택적) */}
      {showBackgroundSpinner && isFetching && <BackgroundSpinner />}
    </>
  );
}

// 더 간단한 버전 (백그라운드 스피너 없음)
export function SimpleDataLoader({
  isLoading,
  isFetching,
  isEnabled,
  data,
  loadingMessage = '데이터를 불러오는 중...',
  children,
}: Omit<DataLoaderProps, 'showBackgroundSpinner'>) {
  if (!data || isLoading || !isEnabled) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  return <>{children}</>;
}
