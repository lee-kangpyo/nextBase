import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMenuResourceService } from '@/services/admin';
import { MenuResource, MenuResourceRequest } from '@/types/menu';
import { useDialog } from '@/components/providers/DialogProvider';

export const useMenuResourceActions = () => {
  const { createMenuResource, updateMenuResource, deleteMenuResource } =
    useMenuResourceService();
  const { showAlert, showConfirm } = useDialog();

  // SweetAlert 포함 함수들
  const handleCreateWithAlert = async (
    data: MenuResourceRequest,
  ): Promise<boolean> => {
    try {
      console.log('handleCreateWithAlert 시작');
      await createMenuResource.mutateAsync(data);
      console.log('createMenuResource 성공');
      await showAlert('성공', '메뉴 리소스가 성공적으로 생성되었습니다.', {
        useSweetAlert: true,
        sweetAlertIcon: 'success',
      });
      console.log('showAlert 성공');
      return true;
    } catch (error) {
      console.log('handleCreateWithAlert 에러:', error);
      await showAlert(
        '오류',
        `메뉴 리소스 생성에 실패했습니다: ${(error as Error).message}`,
        {
          useSweetAlert: true,
          sweetAlertIcon: 'error',
        },
      );
      return false;
    }
  };

  const handleUpdateWithAlert = async (
    resourceId: number,
    data: MenuResourceRequest,
  ): Promise<boolean> => {
    try {
      await updateMenuResource.mutateAsync({ resourceId, data });
      await showAlert('성공', '메뉴 리소스가 성공적으로 수정되었습니다.', {
        useSweetAlert: true,
        sweetAlertIcon: 'success',
      });
      return true;
    } catch (error) {
      await showAlert(
        '오류',
        `메뉴 리소스 수정에 실패했습니다: ${(error as Error).message}`,
        {
          useSweetAlert: true,
          sweetAlertIcon: 'error',
        },
      );
      return false;
    }
  };

  const handleDeleteWithAlert = async (
    resourceId: number,
  ): Promise<boolean> => {
    const result = await showConfirm(
      '삭제 확인',
      '정말 이 메뉴 리소스를 삭제하시겠습니까?',
      {
        useSweetAlert: true,
        sweetAlertIcon: 'warning',
      },
    );

    if (result) {
      try {
        await deleteMenuResource.mutateAsync(resourceId);
        await showAlert('성공', '메뉴 리소스가 성공적으로 삭제되었습니다.', {
          useSweetAlert: true,
          sweetAlertIcon: 'success',
        });
        return true;
      } catch (error) {
        await showAlert(
          '오류',
          `메뉴 리소스 삭제에 실패했습니다: ${(error as Error).message}`,
          {
            useSweetAlert: true,
            sweetAlertIcon: 'error',
          },
        );
        return false;
      }
    }
    return false;
  };

  // 드래그 앤 드롭 함수들
  const handleDragDrop = async (
    draggedItem: MenuResource,
    targetItem: MenuResource,
    newParentId: number | null,
    newDisplayOrder: number,
  ): Promise<boolean> => {
    try {
      await updateMenuResource.mutateAsync({
        resourceId: draggedItem.resourceId,
        data: {
          ...draggedItem,
          parentResourceId: newParentId,
          displayOrder: newDisplayOrder,
        },
      });
      return true;
    } catch (error) {
      console.error('드래그 앤 드롭 실패:', error);
      return false;
    }
  };

  const handleReorder = async (
    items: MenuResource[],
    newOrder: { resourceId: number; displayOrder: number }[],
  ): Promise<boolean> => {
    try {
      // 순서 변경을 위한 배치 업데이트
      const updatePromises = newOrder.map(({ resourceId, displayOrder }) =>
        updateMenuResource.mutateAsync({
          resourceId,
          data: {
            ...items.find((item) => item.resourceId === resourceId)!,
            displayOrder,
          },
        }),
      );

      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error('순서 변경 실패:', error);
      return false;
    }
  };

  return {
    // SweetAlert 포함 함수들
    handleCreateWithAlert,
    handleUpdateWithAlert,
    handleDeleteWithAlert,

    // 드래그 앤 드롭 함수들
    handleDragDrop,
    handleReorder,

    // 로딩 상태들
    isCreating: createMenuResource.isPending,
    isUpdating: updateMenuResource.isPending,
    isDeleting: deleteMenuResource.isPending,
  };
};
