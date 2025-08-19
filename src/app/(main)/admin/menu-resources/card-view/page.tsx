'use client';

import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMenuResourceService } from '@/services/admin';
import {
  MenuResource,
  MenuResourceRequest,
  MenuResourceWithChildren,
} from '@/types/menu';
import DataLoader from '@/components/DataLoader';
import { useMemo, useState } from 'react';
import CardView from './components/CardView';
import MenuResourceDialog from '@/components/interface/menu-resources/MenuResourceDialog';
import { useMenuResourceActions } from '../hooks/useMenuResourceActions';

// 평면 데이터를 트리 구조로 변환하는 함수
function buildMenuTree(
  menuResources: MenuResource[],
): MenuResourceWithChildren[] {
  const menuMap = new Map<number, MenuResourceWithChildren>();
  const rootMenus: MenuResourceWithChildren[] = [];
  const orphanMenus: MenuResourceWithChildren[] = [];

  // 모든 메뉴를 Map에 추가하고 children 배열 초기화
  menuResources.forEach((menu) => {
    menuMap.set(menu.resourceId, { ...menu, children: [], isOrphan: false });
  });

  // 부모-자식 관계 설정
  menuResources.forEach((menu) => {
    if (menu.parentResourceId === null) {
      // 최상위 메뉴
      rootMenus.push(menuMap.get(menu.resourceId)!);
    } else {
      // 하위 메뉴
      const parent = menuMap.get(menu.parentResourceId);
      if (parent) {
        parent.children.push(menuMap.get(menu.resourceId)!);
      } else {
        // 부모가 없는 경우 (고아 메뉴)
        const orphanMenu = menuMap.get(menu.resourceId)!;
        orphanMenu.isOrphan = true;
        orphanMenus.push(orphanMenu);
      }
    }
  });

  // displayOrder로 정렬
  const sortMenus = (menus: MenuResourceWithChildren[]) => {
    menus.sort((a, b) => a.displayOrder - b.displayOrder);
    menus.forEach((menu) => {
      if (menu.children.length > 0) {
        sortMenus(menu.children);
      }
    });
  };

  sortMenus(rootMenus);
  sortMenus(orphanMenus);

  // 가상 루트 노드 생성 (메뉴)
  const virtualRoot: MenuResourceWithChildren = {
    resourceId: 0,
    resourceType: 'MENU_ITEM',
    resourcePattern: '',
    httpMethod: null,
    description: '시스템 전체 메뉴',
    menuName: '메뉴',
    menuUrl: '/',
    iconName: 'Menu',
    parentResourceId: null,
    displayOrder: 0,
    isGroup: true,
    useYn: 'Y',
    children: rootMenus,
    isOrphan: false,
  };

  // 고아 메뉴가 있는 경우 별도 가상 루트 생성
  const result: MenuResourceWithChildren[] = [virtualRoot];

  if (orphanMenus.length > 0) {
    const orphanVirtualRoot: MenuResourceWithChildren = {
      resourceId: -1, // 고아 메뉴용 별도 ID
      resourceType: 'MENU_ITEM',
      resourcePattern: '',
      httpMethod: null,
      description: '분류되지 않은 메뉴들',
      menuName: '미분류 메뉴',
      menuUrl: '/',
      iconName: 'Warning',
      parentResourceId: null,
      displayOrder: 1,
      isGroup: true,
      useYn: 'Y',
      children: orphanMenus,
      isOrphan: false,
    };
    result.push(orphanVirtualRoot);
  }

  return result;
}

export default function MenuResourceCardViewPage() {
  // 실제 데이터 사용
  const { menuResources } = useMenuResourceService();
  const {
    data: menuResourcesData,
    isLoading,
    isFetching,
    isEnabled,
  } = menuResources();

  // CRUD 관련 훅 사용
  const {
    handleCreateWithAlert,
    handleUpdateWithAlert,
    handleDeleteWithAlert,
  } = useMenuResourceActions();

  // 다이얼로그 상태
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<MenuResource | null>(
    null,
  );

  const treeData = useMemo((): MenuResourceWithChildren[] => {
    if (!menuResourcesData) return [];
    return buildMenuTree(menuResourcesData);
  }, [menuResourcesData]);

  // CRUD 핸들러
  const handleEdit = (item: MenuResourceWithChildren) => {
    if (item.resourceId === 0 || item.resourceId === -1) return; // 가상 루트와 미분류 메뉴는 수정 불가
    setEditingResource(item);
    setOpenDialog(true);
  };

  const handleDelete = async (item: MenuResourceWithChildren) => {
    if (item.resourceId === 0 || item.resourceId === -1) return; // 가상 루트와 미분류 메뉴는 삭제 불가
    await handleDeleteWithAlert(item.resourceId);
  };

  const handleToggleUseYn = async (item: MenuResourceWithChildren) => {
    if (item.resourceId === 0 || item.resourceId === -1) return; // 가상 루트와 미분류 메뉴는 토글 불가
    const newUseYn = item.useYn === 'Y' ? 'N' : 'Y';
    await handleUpdateWithAlert(item.resourceId, { ...item, useYn: newUseYn });
  };

  const handleOpenDialog = () => {
    setEditingResource(null);
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
        success = await handleUpdateWithAlert(editingResource.resourceId, data);
      } else {
        success = await handleCreateWithAlert(data);
      }

      if (success) {
        handleCloseDialog();
      }
    } catch (error) {
      console.error('메뉴 리소스 저장 실패:', error);
    }
  };

  return (
    <DataLoader
      data={treeData}
      isLoading={isLoading}
      isFetching={isFetching}
      isEnabled={isEnabled}
      loadingMessage="메뉴 리소스를 불러오는 중..."
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
          <Typography variant="h4">메뉴 리소스 카드 뷰</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            메뉴 추가
          </Button>
        </Box>

        <CardView
          menuData={treeData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleUseYn={handleToggleUseYn}
        />

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
