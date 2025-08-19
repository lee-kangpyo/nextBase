'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMenuResourceService } from '@/services/admin';
import { MenuResource, MenuResourceRequest } from '@/types/menu';
import DataLoader from '@/components/DataLoader';
import TreeView from './components/TreeView';
import MenuResourceDialog from '@/components/interface/menu-resources/MenuResourceDialog';
import { useMenuResourceActions } from '../hooks/useMenuResourceActions';
import { toast } from 'react-toastify';

// 트리 메뉴 타입 정의
interface TreeMenuResource extends MenuResource {
  children: MenuResource[];
  isOrphan?: boolean;
}

// 평면 데이터를 트리 구조로 변환하는 함수
function buildMenuTree(
  menuResources: MenuResource[],
  showInactiveMenus: boolean = true, // 사용여부 필터링 옵션 추가
): TreeMenuResource[] {
  const menuMap = new Map<number, TreeMenuResource>();
  const rootMenus: TreeMenuResource[] = [];
  const orphanMenus: TreeMenuResource[] = [];

  // 모든 메뉴를 Map에 추가하고 children 배열 초기화 (부모-자식 관계 설정을 위해)
  menuResources.forEach((menu) => {
    menuMap.set(menu.resourceId, { ...menu, children: [], isOrphan: false });
  });

  // 부모-자식 관계 설정 (모든 메뉴 대상)
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

  // 비활성 메뉴 필터링 적용
  if (!showInactiveMenus) {
    // 비활성 메뉴를 제거하는 함수
    const removeInactiveMenus = (menus: TreeMenuResource[]) => {
      return menus.filter((menu) => {
        // 현재 메뉴가 활성화되어 있으면 유지
        if (menu.useYn === 'Y') {
          // 자식들도 재귀적으로 필터링
          if (menu.children.length > 0) {
            menu.children = removeInactiveMenus(
              menu.children as TreeMenuResource[],
            );
          }
          return true;
        }
        return false; // 비활성 메뉴는 제거
      });
    };

    // 루트 메뉴와 고아 메뉴에서 비활성 메뉴 제거
    const filteredRootMenus = removeInactiveMenus(rootMenus);
    const filteredOrphanMenus = removeInactiveMenus(orphanMenus);

    // 필터링된 결과로 교체
    rootMenus.length = 0;
    rootMenus.push(...filteredRootMenus);
    orphanMenus.length = 0;
    orphanMenus.push(...filteredOrphanMenus);
  }

  // displayOrder로 정렬
  const sortMenus = (menus: TreeMenuResource[]) => {
    menus.sort((a, b) => a.displayOrder - b.displayOrder);
    menus.forEach((menu) => {
      if (menu.children.length > 0) {
        sortMenus(menu.children as TreeMenuResource[]);
      }
    });
  };

  sortMenus(rootMenus);
  sortMenus(orphanMenus);

  // 가상 루트 노드 생성 (메뉴)
  const virtualRoot: TreeMenuResource = {
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
    children: rootMenus, // 정상 메뉴만 포함
  };

  // 고아 메뉴가 있는 경우 별도 가상 루트 생성
  const result: TreeMenuResource[] = [virtualRoot];

  if (orphanMenus.length > 0) {
    const orphanVirtualRoot: TreeMenuResource = {
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
    };
    result.push(orphanVirtualRoot);
  }

  return result;
}

export default function MenuResourceTreeViewPage() {
  const { menuResources, updateMenuResource } = useMenuResourceService();
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

  // 다이얼로그 상태
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<MenuResource | null>(
    null,
  );

  // 사용여부 필터링 상태
  const [showInactiveMenus, setShowInactiveMenus] = useState(true);

  // 트리 데이터 생성
  const treeData = useMemo((): TreeMenuResource[] => {
    if (!menuResourcesData) return [];
    return buildMenuTree(menuResourcesData, showInactiveMenus);
  }, [menuResourcesData, showInactiveMenus]);

  // CRUD 핸들러
  const handleEdit = (item: TreeMenuResource) => {
    if (item.resourceId === 0 || item.resourceId === -1) return; // 가상 루트와 미분류 메뉴는 수정 불가
    setEditingResource(item);
    setOpenDialog(true);
  };

  const handleDelete = async (item: TreeMenuResource) => {
    if (item.resourceId === 0 || item.resourceId === -1) return; // 가상 루트와 미분류 메뉴는 삭제 불가
    await handleDeleteWithAlert(item.resourceId);
  };

  const handleDragDrop = async (
    draggedItem: MenuResource,
    targetItem: MenuResource,
  ) => {
    try {
      // 고아 메뉴 섹션으로의 이동은 차단 (문제 발생 방지)
      if (targetItem.resourceId === -1) return;

      // 부모만 변경하고 순서는 유지
      let newParentId: number | null = null;

      if (targetItem.resourceId === 0) {
        // 메뉴 가상 루트로 이동 (최상위 메뉴)
        newParentId = null;
      } else {
        // 일반 폴더로 이동
        newParentId = targetItem.resourceId;
      }

      // 서비스의 updateMenuResource 직접 사용
      await updateMenuResource.mutateAsync({
        resourceId: draggedItem.resourceId,
        data: {
          ...draggedItem,
          parentResourceId: newParentId,
          useYn: draggedItem.useYn || 'Y', // null 방지
          // displayOrder는 그대로 유지
        },
      });

      toast.success(
        `${draggedItem.menuName}을(를) ${targetItem.menuName}의 하위로 이동했습니다.`,
      );
    } catch (error) {
      console.error('드래그 앤 드롭 실패:', error);
      toast.error(`메뉴 이동에 실패했습니다: ${(error as Error).message}`);
    }
  };

  const handleOrderChange = async (item: MenuResource, newOrder: number) => {
    try {
      // 순서만 변경
      await updateMenuResource.mutateAsync({
        resourceId: item.resourceId,
        data: {
          ...item,
          displayOrder: newOrder,
        },
      });

      toast.success(`${item.menuName}의 순서를 ${newOrder}로 변경했습니다.`);
    } catch (error) {
      console.error('순서 변경 실패:', error);
      toast.error(`순서 변경에 실패했습니다: ${(error as Error).message}`);
    }
  };

  const handleToggleUseYn = async (item: TreeMenuResource) => {
    try {
      const newUseYn = item.useYn === 'Y' ? 'N' : 'Y';
      const action = newUseYn === 'Y' ? '활성화' : '비활성화';

      await updateMenuResource.mutateAsync({
        resourceId: item.resourceId,
        data: {
          ...item,
          useYn: newUseYn,
        },
      });

      toast.success(`${item.menuName}을(를) ${action}했습니다.`);
    } catch (error) {
      console.error('사용여부 변경 실패:', error);
      toast.error(`사용여부 변경에 실패했습니다: ${(error as Error).message}`);
    }
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
          <Box>
            <Typography variant="h4">메뉴 리소스 트리 뷰</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showInactiveMenus}
                  onChange={(e) => setShowInactiveMenus(e.target.checked)}
                  color="primary"
                />
              }
              label="비활성 메뉴 포함"
              sx={{ mt: 1 }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            메뉴 추가
          </Button>
        </Box>

        <TreeView
          treeData={treeData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDragDrop={handleDragDrop}
          onOrderChange={handleOrderChange}
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
