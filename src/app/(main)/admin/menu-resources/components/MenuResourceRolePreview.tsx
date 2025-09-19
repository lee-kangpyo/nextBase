'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import RoleMenuPreview from '@/components/interface/menu-resources/RoleMenuPreview';

/**
 * 메뉴 관리 페이지에서 사용하는 권한별 메뉴 영향도 확인 컴포넌트
 *
 * 이 컴포넌트는 RoleMenuPreview를 메뉴 관리 맥락에 맞게 래핑하여
 * 메뉴 관리자가 권한별 영향도를 쉽게 확인할 수 있도록 합니다.
 */
export default function MenuResourceRolePreview() {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const handleRolesChange = (roleIds: number[]) => {
    setSelectedRoles(roleIds);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        🎯 권한별 메뉴 영향도 확인
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        선택한 권한을 가진 사용자가 보게 될 메뉴 구조를 확인하여, 메뉴 수정 시
        어떤 권한에 영향을 주는지 파악할 수 있습니다.
      </Typography>

      {/* 권한별 메뉴 미리보기 */}
      <RoleMenuPreview
        selectedRoles={selectedRoles}
        onRolesChange={handleRolesChange}
        context="menu-management"
        showRealTimePreview={true}
        highlightChanges={true}
        maxHeight="600px"
        showRoleFilter={true}
      />
    </Box>
  );
}
