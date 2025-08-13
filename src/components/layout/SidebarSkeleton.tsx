import React from 'react';
import { Box, Skeleton } from '@mui/material';

interface SidebarSkeletonProps {
  isOpen: boolean;
}

const SidebarSkeleton: React.FC<SidebarSkeletonProps> = ({ isOpen }) => {
  // 기본 5개 스켈레톤 (대부분의 경우 충분)
  const skeletonItems = [1, 2, 3, 4, 5];

  return (
    <Box sx={{ p: isOpen ? 2 : 1 }}>
      {skeletonItems.map((i) => (
        <Box key={i} sx={{ mb: 1 }}>
          {isOpen ? (
            // 넓을 때: 아이콘 + 텍스트
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5 }}>
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{ mr: 2 }}
              />
              <Skeleton variant="text" width={120} height={20} />
            </Box>
          ) : (
            // 좁을 때: 아이콘만
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default SidebarSkeleton;
