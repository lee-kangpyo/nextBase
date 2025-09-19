'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Grid,
  Divider,
} from '@mui/material';

import {
  List as ListIcon,
  AccountTree as TreeIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  ViewModule as ViewModuleIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useMenuResourceService } from '@/services/admin';
import DataLoader from '@/components/DataLoader';
import MenuResourceRolePreview from './components/MenuResourceRolePreview';

export default function MenuResourcesPage() {
  const router = useRouter();
  const { menuResources } = useMenuResourceService();

  const {
    data: menuResourcesData,
    isLoading,
    isFetching,
    isEnabled,
  } = menuResources();

  // 통계 계산
  const totalMenus = menuResourcesData?.length || 0;
  const groupMenus = menuResourcesData?.filter((r) => r.isGroup).length || 0;
  const itemMenus = totalMenus - groupMenus;

  const handleViewChange = (view: 'list' | 'tree' | 'card') => {
    if (view === 'list') {
      router.push('/admin/menu-resources/list-view');
    } else if (view === 'tree') {
      router.push('/admin/menu-resources/tree-view');
    } else if (view === 'card') {
      router.push('/admin/menu-resources/card-view');
    }
  };

  const handleQuickAdd = () => {
    router.push('/admin/menu-resources/list-view');
  };

  return (
    <DataLoader
      data={menuResourcesData}
      isLoading={isLoading}
      isFetching={isFetching}
      isEnabled={isEnabled}
      loadingMessage="메뉴 리소스를 불러오는 중..."
    >
      <Box sx={{ p: 3 }}>
        {/* 헤더 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            메뉴 리소스 관리
          </Typography>
          <Typography variant="body1" color="text.secondary">
            시스템 메뉴와 권한을 관리할 수 있습니다.
          </Typography>
        </Box>

        {/* 통계 카드 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {totalMenus}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                전체 메뉴
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {groupMenus}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                그룹 메뉴
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="info">
                {itemMenus}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                일반 메뉴
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success">
                {menuResourcesData?.filter((r) => r.parentResourceId === null)
                  .length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                최상위 메뉴
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 뷰 선택 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            뷰 선택
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <ListIcon
                    sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    리스트 뷰
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    테이블 형태로 모든 메뉴 리소스를 한눈에 확인하고 관리할 수
                    있습니다.
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Chip label="CRUD 작업" size="small" />
                    <Chip label="일괄 관리" size="small" />
                    <Chip label="상세 정보" size="small" />
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<ListIcon />}
                    onClick={() => handleViewChange('list')}
                    size="large"
                  >
                    리스트 뷰 열기
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                ㅇ
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <TreeIcon
                    sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    트리 뷰
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    계층 구조로 메뉴를 시각화하고 드래그 앤 드롭으로 순서를
                    조정할 수 있습니다.
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Chip label="계층 구조" size="small" />
                    <Chip label="드래그 앤 드롭" size="small" />
                    <Chip label="시각적 관리" size="small" />
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<TreeIcon />}
                    onClick={() => handleViewChange('tree')}
                    size="large"
                    color="secondary"
                  >
                    트리 뷰 열기
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <ViewModuleIcon
                    sx={{ fontSize: 60, color: 'info.main', mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    카드 뷰
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    카드 형태로 메뉴 구조를 한눈에 확인하고 관리할 수 있습니다.
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Chip label="카드 레이아웃" size="small" />
                    <Chip label="시각적 구조" size="small" />
                    <Chip label="직관적 관리" size="small" />
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<ViewModuleIcon />}
                    onClick={() => handleViewChange('card')}
                    size="large"
                    color="info"
                  >
                    카드 뷰 열기
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* 빠른 액션 */}
        <Box>
          <Typography variant="h5" gutterBottom>
            빠른 액션
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  새로운 메뉴를 추가하거나 기존 메뉴를 수정하려면
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleQuickAdd}
                  size="large"
                >
                  메뉴 추가하기
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* 권한별 메뉴 영향도 확인 */}
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3, backgroundColor: 'background.default' }}>
            <MenuResourceRolePreview />
          </Paper>
        </Box>
      </Box>
    </DataLoader>
  );
}
