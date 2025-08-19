'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Grid,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Article as ArticleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  VisibilityOff as VisibilityOffIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import { MenuResource, MenuResourceWithChildren } from '@/types/menu';

interface CardViewProps {
  menuData: MenuResourceWithChildren[];
  onEdit: (item: MenuResourceWithChildren) => void;
  onDelete: (item: MenuResourceWithChildren) => void;
  onToggleUseYn: (item: MenuResourceWithChildren) => void;
}

// 가상 메뉴 이름 목록 (제외할 메뉴들)
const VIRTUAL_MENU_NAMES = ['대시보드', '인터페이스', '관리자'];

// 가상 메뉴인지 확인하는 함수
const isVirtualMenu = (menu: MenuResource): boolean => {
  return VIRTUAL_MENU_NAMES.includes(menu.menuName);
};

// 실제 메뉴만 필터링하는 함수
const filterRealMenus = (menuData: MenuResourceWithChildren[]) => {
  const realMenus: MenuResourceWithChildren[] = [];

  menuData.forEach((group) => {
    // 루트 메뉴(resourceId === 0)는 가상이므로 제외
    if (group.resourceId === 0) {
      // 루트 메뉴의 하위 메뉴들을 개별 카드로 변환
      group.children.forEach((child) => {
        realMenus.push({
          ...child,
          children: [], // 빈 배열로 초기화
          isOrphan: false,
        });
      });
    } else if (group.resourceId === -1) {
      // 미분류 메뉴는 그대로 유지
      realMenus.push(group);
    }
    // 다른 그룹들은 제외 (가상 메뉴들)
  });

  return realMenus;
};

export default function CardView({
  menuData,
  onEdit,
  onDelete,
  onToggleUseYn,
}: CardViewProps) {
  // 디버깅: 실제 데이터 구조 확인
  console.log('CardView - 원본 menuData:', menuData);

  // 실제 메뉴만 필터링
  const realMenuData = filterRealMenus(menuData);

  // 디버깅: 필터링된 데이터 확인
  console.log('CardView - 필터링된 realMenuData:', realMenuData);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        카드 형태로 메뉴 구조를 확인할 수 있습니다
      </Typography>
      <Grid container spacing={3}>
        {realMenuData.map((group) => {
          const isOrphan = group.isOrphan;
          const isInactive = group.useYn === 'N';

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={group.resourceId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 3,
                  },
                  // 미분류 메뉴 시각적 구분
                  ...(isOrphan && {
                    border: '2px solid #ff9800',
                    bgcolor: '#fff3e0',
                  }),
                  // 비활성 메뉴 시각적 구분
                  ...(isInactive && {
                    opacity: 0.6,
                    bgcolor: '#f5f5f5',
                    '&:hover': {
                      bgcolor: '#eeeeee',
                    },
                  }),
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1, // 내용 영역이 남은 공간을 모두 차지
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* 내용 영역 */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {group.resourceId === 0 ? (
                        <DashboardIcon color="primary" sx={{ fontSize: 32 }} />
                      ) : group.resourceId === -1 ? (
                        <WarningIcon color="warning" sx={{ fontSize: 32 }} />
                      ) : group.isGroup ? (
                        <FolderIcon color="primary" sx={{ fontSize: 32 }} />
                      ) : (
                        <ArticleIcon sx={{ fontSize: 32 }} />
                      )}

                      {/* 미분류 메뉴 경고 아이콘 */}
                      {isOrphan && (
                        <WarningIcon color="warning" sx={{ fontSize: 20 }} />
                      )}

                      {/* 비활성 메뉴 아이콘 */}
                      {isInactive && (
                        <VisibilityOffIcon
                          color="disabled"
                          sx={{ fontSize: 20 }}
                        />
                      )}

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight:
                            group.resourceId === 0 || group.resourceId === -1
                              ? 'bold'
                              : 'normal',
                          color:
                            group.resourceId === -1 ? '#ff9800' : 'inherit',
                        }}
                      >
                        {group.menuName}
                        {group.resourceId === -1 && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              ml: 1,
                              px: 1,
                              py: 0.5,
                              bgcolor: '#ff9800',
                              color: 'white',
                              borderRadius: 1,
                              fontSize: '0.7rem',
                            }}
                          >
                            미분류
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {group.description || '설명이 없습니다.'}
                    </Typography>
                    {group.children && group.children.length > 0 ? (
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          하위 메뉴:
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {group.children.map((child) => (
                            <Chip
                              key={child.resourceId}
                              label={child.menuName}
                              size="small"
                              variant="outlined"
                              icon={
                                child.isGroup ? (
                                  <FolderIcon fontSize="small" />
                                ) : (
                                  <ArticleIcon fontSize="small" />
                                )
                              }
                            />
                          ))}
                        </Stack>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        하위 메뉴가 없습니다
                      </Typography>
                    )}
                  </Box>

                  {/* 편집/삭제/활성화 버튼 */}
                  {group.resourceId !== 0 && group.resourceId !== -1 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        height: '48px', // 버튼 영역 고정 높이
                        alignItems: 'center', // 세로 중앙 정렬
                        flexShrink: 0, // 크기 고정
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => onEdit(group)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onToggleUseYn(group)}
                        sx={{
                          color:
                            group.useYn === 'Y'
                              ? 'success.main'
                              : 'warning.main',
                          '&:hover': {
                            color:
                              group.useYn === 'Y'
                                ? 'success.dark'
                                : 'warning.dark',
                          },
                        }}
                        title={group.useYn === 'Y' ? '비활성화' : '활성화'}
                      >
                        {group.useYn === 'Y' ? (
                          <ToggleOnIcon />
                        ) : (
                          <ToggleOffIcon />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(group)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
