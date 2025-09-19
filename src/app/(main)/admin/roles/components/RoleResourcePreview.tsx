'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import RoleMenuPreview from '@/components/interface/menu-resources/RoleMenuPreview';

/**
 * 권한 관리 페이지에서 사용하는 권한별 메뉴 미리보기 컴포넌트
 *
 * 이 컴포넌트는 RoleMenuPreview를 권한 관리 맥락에 맞게 래핑하여
 * 권한 관리자가 권한 할당 결과를 쉽게 미리볼 수 있도록 합니다.
 */
export default function RoleResourcePreview() {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const handleRolesChange = (roleIds: number[]) => {
    setSelectedRoles(roleIds);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <SecurityIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h5" gutterBottom>
            🔐 권한별 메뉴 미리보기
          </Typography>
          <Typography variant="body1" color="text.secondary">
            선택한 권한을 가진 사용자가 실제로 보게 될 메뉴를 미리 확인하여,
            권한 할당의 정확성을 검증할 수 있습니다.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 권한별 메뉴 미리보기 */}
      <RoleMenuPreview
        selectedRoles={selectedRoles}
        onRolesChange={handleRolesChange}
        context="role-management"
        showRealTimePreview={true}
        highlightChanges={false}
        maxHeight="500px"
        showRoleFilter={true}
      />

      {/* 권한 관리 가이드 */}
      <Accordion sx={{ mt: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="info" />
            <Typography variant="subtitle1">권한 관리 가이드</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" paragraph>
              <strong>1. 권한 선택:</strong> 확인하고 싶은 권한을 선택하세요
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>2. 메뉴 미리보기:</strong> 해당 권한을 가진 사용자가 보게
              될 메뉴를 확인하세요
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>3. 권한 검증:</strong> 의도한 메뉴가 올바르게 표시되는지
              검증하세요
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>4. 권한 조정:</strong> 필요시 권한 할당을 추가/제거하여
              조정하세요
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 권한 할당 시 주의사항 */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon color="warning" />
            <Typography variant="subtitle1">권한 할당 시 주의사항</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2" paragraph>
              <strong>🔒 보안:</strong> 민감한 메뉴는 필요한 권한에만 할당하세요
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>📱 사용성:</strong> 사용자가 필요한 메뉴에 접근할 수
              있는지 확인하세요
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>🔄 일관성:</strong> 유사한 권한 수준의 사용자에게 일관된
              메뉴를 제공하세요
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>📊 모니터링:</strong> 권한 변경 후 사용자 피드백을
              수집하여 검증하세요
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 실시간 권한 할당 확인 */}
      {selectedRoles.length > 0 && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>✅ 실시간 확인:</strong> 권한 할당/제거 시 이 미리보기가
            실시간으로 업데이트되어 변경 사항을 즉시 확인할 수 있습니다.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
