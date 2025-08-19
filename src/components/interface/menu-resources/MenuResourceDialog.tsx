'use client';

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { MenuResource, MenuResourceRequest } from '@/types/menu';
import IconSelector from '@/components/IconSelector/IconSelector';

interface MenuResourceDialogProps {
  open: boolean;
  editingResource: MenuResource | null;
  menuResourcesData: MenuResource[] | undefined;
  onSubmit: (data: MenuResourceRequest) => Promise<void>;
  onCancel: () => void;
}

export default function MenuResourceDialog({
  open,
  editingResource,
  menuResourcesData,
  onSubmit,
  onCancel,
}: MenuResourceDialogProps) {
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

  // editingResource가 변경될 때마다 formData 업데이트
  useEffect(() => {
    if (editingResource) {
      setFormData({
        resourcePattern: editingResource.resourcePattern,
        description: editingResource.description,
        menuName: editingResource.menuName,
        menuUrl: editingResource.menuUrl,
        iconName: editingResource.iconName,
        parentResourceId: editingResource.parentResourceId,
        displayOrder: editingResource.displayOrder,
        isGroup: editingResource.isGroup,
      });
    } else {
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
  }, [editingResource]);

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>{editingResource ? '메뉴 수정' : '메뉴 추가'}</DialogTitle>
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
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
        <Button onClick={onCancel}>취소</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingResource ? '수정' : '추가'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
