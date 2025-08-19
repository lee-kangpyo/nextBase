'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import * as MuiIcons from '@mui/icons-material';
import { MenuResource, MenuResourceRequest } from '@/types/menu';
import DataLoader from '@/components/DataLoader';
import MenuResourceDialog from '@/components/interface/menu-resources/MenuResourceDialog';
import { useMenuResourceActions } from '../hooks/useMenuResourceActions';
import { useMenuResourceService } from '@/services/admin';

export default function MenuResourceListViewPage() {
  const { menuResources } = useMenuResourceService();
  const {
    handleCreateWithAlert,
    handleUpdateWithAlert,
    handleDeleteWithAlert,
  } = useMenuResourceActions();

  // 함수 호출 후 구조분해
  const {
    data: menuResourcesData,
    isLoading,
    isFetching,
    isEnabled,
  } = menuResources();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<MenuResource | null>(
    null,
  );

  const handleOpenDialog = (resource?: MenuResource) => {
    setEditingResource(resource || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingResource(null);
  };

  const handleSubmit = async (data: MenuResourceRequest) => {
    try {
      let success = false;
      if (editingResource) {
        console.log('수정 시도...');
        success = await handleUpdateWithAlert(editingResource.resourceId, data);
        console.log('수정 결과:', success);
      } else {
        console.log('생성 시도...');
        success = await handleCreateWithAlert(data);
        console.log('생성 결과:', success);
      }

      console.log('최종 성공 여부:', success);
      if (success) {
        console.log('모달 닫기 시도...');
        handleCloseDialog();
      } else {
        console.log('성공하지 못해서 모달 유지');
      }
    } catch (error) {
      // 에러는 useMenuResourceActions에서 처리됨
      console.error('메뉴 리소스 저장 실패:', error);
    }
  };

  const handleDelete = async (resourceId: number) => {
    await handleDeleteWithAlert(resourceId);
  };

  return (
    <DataLoader
      data={menuResourcesData}
      isLoading={isLoading}
      isFetching={isFetching}
      isEnabled={isEnabled}
      loadingMessage="메뉴 리소스를 불러오는 중..."
      showBackgroundSpinner={true}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4">메뉴 리소스 목록</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            메뉴 추가
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>메뉴명</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>아이콘</TableCell>
                <TableCell>패턴</TableCell>
                <TableCell>순서</TableCell>
                <TableCell>그룹</TableCell>
                <TableCell>부모</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuResourcesData?.map((resource) => (
                <TableRow
                  key={resource.resourceId}
                  sx={{
                    // 미분류 메뉴 시각적 구분
                    ...(resource.resourceId === -1 && {
                      bgcolor: '#fff3e0',
                      '&:hover': {
                        bgcolor: '#ffe0b2',
                      },
                    }),
                  }}
                >
                  <TableCell>{resource.resourceId}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {resource.resourceId === -1 && (
                        <WarningIcon color="warning" sx={{ fontSize: 20 }} />
                      )}
                      {resource.menuName}
                      {resource.resourceId === -1 && (
                        <Chip
                          label="미분류"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{resource.menuUrl}</TableCell>
                  <TableCell>
                    {(() => {
                      const IconComponent = resource.iconName
                        ? (MuiIcons as any)[resource.iconName]
                        : null;
                      return IconComponent ? (
                        <IconComponent />
                      ) : (
                        resource.iconName
                      );
                    })()}
                  </TableCell>
                  <TableCell>{resource.resourcePattern}</TableCell>
                  <TableCell>{resource.displayOrder}</TableCell>
                  <TableCell>
                    <Chip
                      label={resource.isGroup ? '그룹' : '메뉴'}
                      color={resource.isGroup ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {resource.parentResourceId
                      ? resource.parentResourceId
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {/* 미분류 메뉴는 수정/삭제 불가 */}
                    {resource.resourceId !== -1 && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(resource)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(resource.resourceId)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <MenuResourceDialog
          open={openDialog}
          editingResource={editingResource}
          menuResourcesData={menuResourcesData}
          onSubmit={handleSubmit}
          onCancel={handleCloseDialog}
        />
      </Box>
    </DataLoader>
  );
}
