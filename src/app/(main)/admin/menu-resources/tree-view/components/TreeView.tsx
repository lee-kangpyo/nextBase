'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Collapse } from '@mui/material';
import {
  DragIndicator as DragIcon,
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Article as ArticleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  VisibilityOff as VisibilityOffIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import { MenuResource, MenuResourceWithChildren } from '@/types/menu';

interface TreeViewProps {
  treeData: MenuResourceWithChildren[];
  onEdit: (item: MenuResourceWithChildren) => void;
  onDelete: (item: MenuResourceWithChildren) => void;
  onDragDrop: (draggedItem: MenuResource, targetItem: MenuResource) => void;
  onOrderChange: (item: MenuResource, newOrder: number) => void;
  onToggleUseYn: (item: MenuResourceWithChildren) => void;
}

// 트리 아이템 컴포넌트
function TreeItem({
  item,
  level = 0,
  onDragStart,
  onDrop,
  onEdit,
  onDelete,
  onOrderChange,
  onToggleUseYn,
}: {
  item: MenuResourceWithChildren;
  level?: number;
  onDragStart: (e: React.DragEvent, item: any) => void;
  onDrop: (e: React.DragEvent, targetItem: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onOrderChange: (item: MenuResource, newOrder: number) => void;
  onToggleUseYn: (item: MenuResourceWithChildren) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orderValue, setOrderValue] = useState(item.displayOrder.toString());

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, item);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 방지
    if (item.resourceId === 0) return; // 가상 루트는 편집 불가
    setIsEditingOrder(true);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderValue(e.target.value);
  };

  const handleOrderSave = () => {
    const newOrder = parseInt(orderValue);
    if (!isNaN(newOrder) && newOrder > 0) {
      onOrderChange(item, newOrder);
      setIsEditingOrder(false);
    }
  };

  const handleOrderCancel = () => {
    setOrderValue(item.displayOrder.toString());
    setIsEditingOrder(false);
  };

  const handleOrderKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOrderSave();
    } else if (e.key === 'Escape') {
      handleOrderCancel();
    }
  };

  const isGroup = item.children && item.children.length > 0;
  const isOrphan = item.isOrphan;
  const isInactive = item.useYn === 'N';

  return (
    <Box>
      <Paper
        draggable={item.resourceId !== 0 && item.resourceId !== -1}
        onDragStart={
          item.resourceId !== 0 && item.resourceId !== -1
            ? handleDragStart
            : undefined
        }
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => {
          if (isGroup) {
            setIsExpanded(!isExpanded);
          }
        }}
        sx={{
          mb: 1,
          ml: level * 3,
          p: 2,
          cursor:
            item.resourceId === 0 || item.resourceId === -1
              ? 'default'
              : 'grab',
          '&:hover': {
            bgcolor:
              item.resourceId === 0 || item.resourceId === -1
                ? 'transparent'
                : 'action.hover',
          },
          '&:active': {
            cursor:
              item.resourceId === 0 || item.resourceId === -1
                ? 'default'
                : 'grabbing',
          },
          // 폴더인 경우 드롭 가능함을 시각적으로 표시
          ...(item.isGroup && {
            border: '2px dashed transparent',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
            },
          }),
          // 미분류 메뉴 시각적 구분
          ...(isOrphan && {
            border: '2px solid #ff9800',
            bgcolor: '#fff3e0',
            '&:hover': {
              bgcolor: '#ffe0b2',
            },
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DragIcon color="action" />
          {item.resourceId === 0 ? (
            <DashboardIcon color="primary" sx={{ fontSize: 28 }} />
          ) : item.resourceId === -1 ? (
            <WarningIcon color="warning" sx={{ fontSize: 28 }} />
          ) : isGroup ? (
            <FolderIcon color="primary" />
          ) : (
            <ArticleIcon />
          )}

          {/* 미분류 메뉴 경고 아이콘 */}
          {isOrphan && <WarningIcon color="warning" sx={{ fontSize: 20 }} />}

          {/* 비활성 메뉴 아이콘 */}
          {isInactive && (
            <VisibilityOffIcon color="disabled" sx={{ fontSize: 20 }} />
          )}

          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              fontWeight:
                item.resourceId === 0 || item.resourceId === -1
                  ? 'bold'
                  : 'normal',
              color:
                item.resourceId === 0
                  ? 'primary.main'
                  : item.resourceId === -1
                    ? '#ff9800'
                    : isOrphan
                      ? '#ff9800'
                      : isInactive
                        ? 'text.disabled'
                        : 'inherit',
            }}
          >
            {item.menuName}
            {isOrphan && (
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
            {isInactive && (
              <Typography
                component="span"
                variant="caption"
                sx={{
                  ml: 1,
                  px: 1,
                  py: 0.5,
                  bgcolor: 'grey.400',
                  color: 'white',
                  borderRadius: 1,
                  fontSize: '0.7rem',
                }}
              >
                비활성
              </Typography>
            )}
          </Typography>

          {/* 순서 표시 및 편집 */}
          {item.resourceId !== 0 && item.resourceId !== -1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isEditingOrder ? (
                <>
                  <input
                    type="number"
                    value={orderValue}
                    onChange={handleOrderChange}
                    onKeyDown={handleOrderKeyPress}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '60px',
                      padding: '4px 8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    autoFocus
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderSave();
                    }}
                    sx={{ color: 'success.main' }}
                  >
                    ✓
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderCancel();
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    ✕
                  </IconButton>
                </>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.200' },
                  }}
                  onClick={handleOrderClick}
                >
                  {item.displayOrder}
                </Typography>
              )}
            </Box>
          )}
          {isGroup && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              sx={{ color: 'primary.main' }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          {item.resourceId !== 0 && item.resourceId !== -1 && (
            <>
              <IconButton
                size="small"
                onClick={() => onEdit(item)}
                sx={{ color: 'primary.main' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onToggleUseYn(item)}
                sx={{
                  color: item.useYn === 'Y' ? 'success.main' : 'warning.main',
                  '&:hover': {
                    color: item.useYn === 'Y' ? 'success.dark' : 'warning.dark',
                  },
                }}
                title={item.useYn === 'Y' ? '비활성화' : '활성화'}
              >
                {item.useYn === 'Y' ? <ToggleOnIcon /> : <ToggleOffIcon />}
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(item)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Paper>
      {isGroup && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ ml: 2 }}>
            {item.children.map((child) => (
              <TreeItem
                key={child.resourceId}
                item={child as MenuResourceWithChildren}
                level={level + 1}
                onDragStart={onDragStart}
                onDrop={onDrop}
                onEdit={onEdit}
                onDelete={onDelete}
                onOrderChange={onOrderChange}
                onToggleUseYn={onToggleUseYn}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

export default function TreeView({
  treeData,
  onEdit,
  onDelete,
  onDragDrop,
  onOrderChange,
  onToggleUseYn,
}: TreeViewProps) {
  const [draggedItem, setDraggedItem] =
    useState<MenuResourceWithChildren | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    item: MenuResourceWithChildren,
  ) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (
    e: React.DragEvent,
    targetItem: MenuResourceWithChildren,
  ) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.resourceId === targetItem.resourceId) {
      return;
    }

    // 드롭 가능한지 확인 (폴더에만 드롭 가능, 미분류 메뉴 섹션도 허용)
    if (
      targetItem.isGroup ||
      targetItem.resourceId === 0 ||
      targetItem.resourceId === -1
    ) {
      // 실제 API 호출로 메뉴 이동 처리
      onDragDrop(draggedItem, targetItem);
    }
    // 폴더가 아닌 경우 아무 동작 안함

    setDraggedItem(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        드래그 앤 드롭으로 메뉴 순서를 변경할 수 있습니다
      </Typography>
      {treeData.map((item) => (
        <TreeItem
          key={item.resourceId}
          item={item}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onEdit={onEdit}
          onDelete={onDelete}
          onOrderChange={onOrderChange}
          onToggleUseYn={onToggleUseYn}
        />
      ))}
    </Box>
  );
}
