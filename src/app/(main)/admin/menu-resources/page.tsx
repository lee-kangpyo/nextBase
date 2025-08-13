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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import * as MuiIcons from '@mui/icons-material';
import { useMenuResourceService } from '@/services/admin';
import { MenuResource, MenuResourceRequest } from '@/types/menu';
import DataLoader from '@/components/DataLoader';
import IconSelector from '@/components/IconSelector/IconSelector';

export default function MenuResourcesPage() {
  const {
    menuResources,
    createMenuResource,
    updateMenuResource,
    deleteMenuResource,
  } = useMenuResourceService();

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
  const [formData, setFormData] = useState<MenuResourceRequest>({
    resourcePattern: '',
    description: '',
    menuName: '',
    menuUrl: '',
    iconName: '',
    parentResourceId: null,
    displayOrder: 1,
    isGroup: false,
  });

  const handleOpenDialog = (resource?: MenuResource) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        resourcePattern: resource.resourcePattern,
        description: resource.description,
        menuName: resource.menuName,
        menuUrl: resource.menuUrl,
        iconName: resource.iconName,
        parentResourceId: resource.parentResourceId,
        displayOrder: resource.displayOrder,
        isGroup: resource.isGroup,
      });
    } else {
      setEditingResource(null);
      setFormData({
        resourcePattern: '',
        description: '',
        menuName: '',
        menuUrl: '',
        iconName: '',
        parentResourceId: null,
        displayOrder: 1,
        isGroup: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingResource(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingResource) {
        await updateMenuResource.mutateAsync({
          resourceId: editingResource.resourceId,
          data: formData,
        });
      } else {
        await createMenuResource.mutateAsync(formData);
      }
      handleCloseDialog();
    } catch (error) {
      alert('메뉴 리소스 저장에 실패했습니다: ' + (error as Error).message);
    }
  };

  const handleDelete = async (resourceId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteMenuResource.mutateAsync(resourceId);
      } catch (error) {
        alert('메뉴 리소스 삭제에 실패했습니다: ' + (error as Error).message);
      }
    }
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
          <Typography variant="h4">메뉴 리소스 관리</Typography>
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
                <TableRow key={resource.resourceId}>
                  <TableCell>{resource.resourceId}</TableCell>
                  <TableCell>{resource.menuName}</TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingResource ? '메뉴 수정' : '메뉴 추가'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
              <TextField
                label="메뉴명"
                value={formData.menuName}
                onChange={(e) =>
                  setFormData({ ...formData, menuName: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="URL"
                value={formData.menuUrl}
                onChange={(e) =>
                  setFormData({ ...formData, menuUrl: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="리소스 패턴"
                value={formData.resourcePattern}
                onChange={(e) =>
                  setFormData({ ...formData, resourcePattern: e.target.value })
                }
                fullWidth
                required
              />
              <IconSelector
                label="아이콘"
                value={formData.iconName}
                onChange={(iconName) => setFormData({ ...formData, iconName })}
              />
              <TextField
                label="설명"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                fullWidth
                multiline
                rows={2}
              />
              <Box
                sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
              >
                <TextField
                  label="표시 순서"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: Number(e.target.value),
                    })
                  }
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>부모 메뉴</InputLabel>
                  <Select
                    value={formData.parentResourceId || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parentResourceId: e.target.value || null,
                      })
                    }
                    label="부모 메뉴"
                  >
                    <MenuItem value="">없음</MenuItem>
                    {menuResourcesData
                      ?.filter((r: MenuResource) => r.isGroup)
                      .map((resource) => (
                        <MenuItem
                          key={resource.resourceId}
                          value={resource.resourceId}
                        >
                          {resource.menuName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
              <FormControl fullWidth>
                <InputLabel>메뉴 타입</InputLabel>
                <Select
                  value={formData.isGroup ? 'group' : 'menu'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isGroup: e.target.value === 'group',
                    })
                  }
                  label="메뉴 타입"
                >
                  <MenuItem value="menu">일반 메뉴</MenuItem>
                  <MenuItem value="group">그룹 메뉴</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>취소</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingResource ? '수정' : '추가'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DataLoader>
  );
}
