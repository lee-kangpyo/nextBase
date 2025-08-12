'use client';
import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import DataLoader from '@/components/DataLoader';
import {
  useRoleService,
  useResourceService,
  useRoleResourceService,
} from '@/services/admin';

// 타입 정의 추가
interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

// 역할 리소스 리스트 컴포넌트
function RoleResourceList({
  roleId,
  onRemove,
}: {
  roleId: number;
  onRemove: (resourceId: number) => void;
}) {
  const { useRoleResources } = useRoleResourceService();
  const {
    data: roleResources,
    isLoading,
    isFetching,
    isEnabled,
  } = useRoleResources(roleId);

  if (isLoading || isFetching || !isEnabled) {
    return <Typography>로딩 중...</Typography>;
  }

  if (!roleResources || roleResources.length === 0) {
    return (
      <Typography color="text.secondary">할당된 리소스가 없습니다.</Typography>
    );
  }

  // 그룹은 제외하고 일반 메뉴만 표시
  const displayResources = roleResources.filter(
    (resource) => !resource.isGroup,
  );

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {displayResources.map((resource) => (
        <Chip
          key={resource.resourceId}
          label={resource.menuName}
          onDelete={() => onRemove(resource.resourceId)}
          color="primary"
          variant="outlined"
        />
      ))}
    </Box>
  );
}

// 사용 가능한 리소스 리스트 컴포넌트
function AvailableResourceList({
  roleId,
  onAdd,
}: {
  roleId: number;
  onAdd: (resourceId: number) => void;
}) {
  const { menuResources } = useResourceService();
  const {
    data: menuResourcesData,
    isLoading: menuLoading,
    isFetching: menuFetching,
    isEnabled: menuEnabled,
  } = menuResources();
  const { useRoleResources } = useRoleResourceService();
  const {
    data: roleResources,
    isLoading: roleLoading,
    isFetching: roleFetching,
    isEnabled: roleEnabled,
  } = useRoleResources(roleId);

  if (
    !menuResources ||
    menuLoading ||
    menuFetching ||
    roleLoading ||
    roleFetching ||
    !menuEnabled ||
    !roleEnabled
  ) {
    return <Typography>로딩 중...</Typography>;
  }

  // 이미 할당된 리소스 ID 목록
  const assignedResourceIds = roleResources?.map((r) => r.resourceId) || [];

  // 할당되지 않은 리소스들 (그룹 제외, 일반 메뉴만)
  const availableResources = (menuResourcesData || []).filter(
    (resource) =>
      !assignedResourceIds.includes(resource.resourceId) && !resource.isGroup, // 그룹 제외
  );

  if (availableResources.length === 0) {
    return (
      <Typography color="text.secondary">
        사용 가능한 리소스가 없습니다.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {availableResources.map((resource) => (
        <Chip
          key={resource.resourceId}
          label={resource.menuName}
          onClick={() => onAdd(resource.resourceId)}
          color="default"
          variant="outlined"
          clickable
        />
      ))}
    </Box>
  );
}

export default function RolesPage() {
  const { roles: roleList } = useRoleService();

  // 함수 호출 후 구조분해
  const { data: roles, isLoading, isFetching, isEnabled } = roleList();
  const { menuResources } = useResourceService();
  const { data: menuResourcesData } = menuResources();
  const { createRole, updateRole, deleteRole } = useRoleService();
  const { addRoleResource, removeRoleResource } = useRoleResourceService();

  const [openDialog, setOpenDialog] = useState(false);
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      await updateRole.mutateAsync({
        roleId: editingRole.roleId,
        data: { description: formData.description },
      });
    } else {
      await createRole.mutateAsync(formData);
    }
    setOpenDialog(false);
    setEditingRole(null);
    setFormData({ roleName: '', description: '' });
  };

  const handleOpenResourceDialog = (role: Role) => {
    setSelectedRole(role);
    setOpenResourceDialog(true);
  };

  const handleAddResource = async (resourceId: number) => {
    if (selectedRole) {
      try {
        await addRoleResource.mutateAsync({
          roleId: selectedRole.roleId,
          resourceId,
        });
      } catch (error) {
        alert('리소스 추가에 실패했습니다: ' + (error as Error).message);
      }
    }
  };

  const handleRemoveResource = async (resourceId: number) => {
    if (selectedRole) {
      try {
        await removeRoleResource.mutateAsync({
          roleId: selectedRole.roleId,
          resourceId,
        });
      } catch (error) {
        alert('리소스 제거에 실패했습니다: ' + (error as Error).message);
      }
    }
  };

  return (
    <DataLoader
      data={roles}
      isLoading={isLoading}
      isFetching={isFetching}
      isEnabled={isEnabled}
      loadingMessage="권한 목록을 불러오는 중..."
      showBackgroundSpinner={true}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">권한 관리</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            권한 추가
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>권한 ID</TableCell>
                <TableCell>권한명</TableCell>
                <TableCell>설명</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(roles) ? (
                roles.map((role: Role) => (
                  <TableRow key={role.roleId}>
                    <TableCell>{role.roleId}</TableCell>
                    <TableCell>{role.roleName}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setEditingRole(role);
                          setFormData({
                            roleName: role.roleName,
                            description: role.description,
                          });
                          setOpenDialog(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenResourceDialog(role)}
                        color="primary"
                      >
                        <SettingsIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteRole.mutate(role.roleId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>데이터를 불러올 수 없습니다.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 생성/수정 다이얼로그 */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{editingRole ? '권한 수정' : '권한 추가'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="권한명"
              value={formData.roleName}
              onChange={(e) =>
                setFormData({ ...formData, roleName: e.target.value })
              }
              disabled={!!editingRole} // 수정 시에는 권한명 변경 불가
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              label="설명"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>취소</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingRole ? '수정' : '추가'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* 리소스 할당 다이얼로그 */}
        <Dialog
          open={openResourceDialog}
          onClose={() => setOpenResourceDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{selectedRole?.roleName} - 리소스 관리</DialogTitle>
          <DialogContent>
            {selectedRole && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  할당된 리소스
                </Typography>
                <RoleResourceList
                  roleId={selectedRole.roleId}
                  onRemove={handleRemoveResource}
                />

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  사용 가능한 리소스
                </Typography>
                <AvailableResourceList
                  roleId={selectedRole.roleId}
                  onAdd={handleAddResource}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenResourceDialog(false)}>닫기</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DataLoader>
  );
}
