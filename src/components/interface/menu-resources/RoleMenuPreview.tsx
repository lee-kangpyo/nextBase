'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Collapse,
  IconButton,
  Chip,
  Alert,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as VisibilityIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useRoleMenuService } from '@/services/admin';
import { MenuResourceWithChildren, RoleMenuUnionResponse } from '@/types/menu';
import RoleFilter from './RoleFilter';
import { getIconComponent } from '@/utils/iconHelper';

interface RoleMenuPreviewProps {
  selectedRoles?: number[];
  onRolesChange?: (roleIds: number[]) => void;
  showRealTimePreview?: boolean;
  highlightChanges?: boolean;
  context?: 'menu-management' | 'role-management';
  maxHeight?: string | number;
  showRoleFilter?: boolean;
}

interface MenuTreeItemProps {
  item: MenuResourceWithChildren;
  level?: number;
  isHighlighted?: boolean;
}

// 메뉴 트리 아이템 컴포넌트
function MenuTreeItem({
  item,
  level = 0,
  isHighlighted = false,
}: MenuTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 0.5,
          pl: level * 3, // 들여쓰기 간격 증가 (2 → 3)
          pr: 1,
          borderRadius: 1,
          backgroundColor:
            level === 0
              ? 'primary.50' // 최상위 레벨: 연한 파란색 배경
              : level % 2 === 0
                ? 'grey.50' // 짝수 레벨: 연한 회색 배경
                : 'transparent', // 홀수 레벨: 투명 배경
          borderLeft: level === 0 ? '3px solid' : '1px solid', // 최상위 레벨 강조
          borderLeftColor: level === 0 ? 'primary.main' : 'divider', // 최상위 레벨 색상
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {hasChildren ? (
          <Box sx={{ mr: 1, p: 0.5, width: 24, height: 32 }}>
            <IconButton size="small" onClick={handleToggle} sx={{ p: 0 }}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ mr: 1, p: 0.5, width: 24, height: 32 }} /> // 빈 공간으로 정렬
        )}

        <Box sx={{ mr: 1, fontSize: '1.2em' }}>
          {getIconComponent(item.iconName)}
        </Box>

        <Typography
          variant="body2"
          sx={{
            flex: 1,
            fontWeight: level === 0 ? 'bold' : 'normal', // 0뎁스는 무조건 진하게
            fontSize: level === 0 ? '1.1rem' : '0.9rem', // 최상위 레벨 폰트 크기 증가
            color:
              level === 0
                ? 'primary.main'
                : item.useYn === 'N'
                  ? 'text.disabled'
                  : 'text.primary', // 최상위 레벨 색상 강조
          }}
        >
          {item.menuName}
        </Typography>

        {item.useYn === 'N' && (
          <Chip
            label="비활성"
            size="small"
            color="warning"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        )}

        {item.isOrphan && (
          <Chip
            icon={<WarningIcon />}
            label="고아"
            size="small"
            color="error"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ pl: 2 }}>
            {item.children.map((child) => (
              <MenuTreeItem
                key={child.resourceId}
                item={child}
                level={level + 1}
                isHighlighted={isHighlighted}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

export default function RoleMenuPreview({
  selectedRoles: externalSelectedRoles,
  onRolesChange: externalOnRolesChange,
  showRealTimePreview = false,
  highlightChanges = false,
  context = 'menu-management',
  maxHeight = '500px',
  showRoleFilter = true,
}: RoleMenuPreviewProps) {
  const [internalSelectedRoles, setInternalSelectedRoles] = useState<number[]>(
    [],
  );
  const { fetchMenuByRoles } = useRoleMenuService();

  // 내부/외부 상태 관리
  const selectedRoles = externalSelectedRoles || internalSelectedRoles;
  const onRolesChange = externalOnRolesChange || setInternalSelectedRoles;

  // 권한별 메뉴 데이터
  const [menuData, setMenuData] = useState<RoleMenuUnionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 권한 변경 시 메뉴 데이터 조회
  useEffect(() => {
    const fetchMenuData = async () => {
      if (selectedRoles.length === 0) {
        setMenuData(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMenuByRoles(selectedRoles);
        setMenuData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '메뉴 데이터 조회에 실패했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [selectedRoles]);

  return (
    <Paper sx={{ p: 3, maxHeight, overflow: 'auto' }}>
      {/* 권한 선택 필터 */}
      {showRoleFilter && (
        <Box sx={{ mb: 3 }}>
          <RoleFilter
            selectedRoles={selectedRoles}
            onRolesChange={onRolesChange}
            maxSelection={50}
            label="권한 선택"
            helperText="권한을 선택하면 해당 권한을 가진 사용자가 보게 될 메뉴를 미리볼 수 있습니다."
          />
        </Box>
      )}

      {/* 메뉴 미리보기 */}
      <Box>
        {isLoading && (
          <Box>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="70%" height={24} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!isLoading && !error && selectedRoles.length === 0 && (
          <Alert severity="info" icon={<InfoIcon />}>
            권한을 선택하면 메뉴 미리보기가 표시됩니다.
          </Alert>
        )}

        {!isLoading && !error && selectedRoles.length > 0 && menuData && (
          <Box>
            {/* 요약 정보 */}
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" gutterBottom>
                <strong>선택된 권한:</strong> {selectedRoles.length}개
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>총 메뉴 수:</strong> {menuData.totalMenuCount}개
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <VisibilityIcon
                  sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }}
                />
                실제 사용자가 보게 될 메뉴 구조
              </Typography>
            </Box>

            {/* 메뉴 트리 */}
            <Box>
              {menuData.menuResources.map((item) => (
                <MenuTreeItem
                  key={item.resourceId}
                  item={item}
                  level={0}
                  isHighlighted={highlightChanges}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
