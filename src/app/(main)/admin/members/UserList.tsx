// src/app/main/UserList.tsx
'use client';
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Typography,
  Stack,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import DataLoader from '@/components/DataLoader';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import type { AxiosError } from 'axios';
import {
  useAdminUserList,
  useRoles,
  useAddUserRole,
  useRemoveUserRole,
  useActivateUser,
  useDeactivateUser,
  useResetLoginFailure,
} from '@/services/adminService';

export default function UserList() {
  const { data, isLoading, isFetching, isEnabled, error } = useAdminUserList();
  const { data: roles } = useRoles();
  const addUserRole = useAddUserRole();
  const removeUserRole = useRemoveUserRole();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const resetLoginFailure = useResetLoginFailure();

  // 권한 관리 상태
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // selectedUser는 다이얼로그에서 사용하므로 null로 설정하지 않음
  };

  const handleAddRole = async () => {
    if (!selectedUser) {
      alert('사용자가 선택되지 않았습니다.');
      return;
    }

    if (!selectedRoleId) {
      alert('권한이 선택되지 않았습니다.');
      return;
    }

    try {
      await addUserRole.mutateAsync({
        userName: selectedUser.userName,
        roleId: selectedRoleId,
      });

      setOpenAddDialog(false);
      setSelectedUser(null);
      setSelectedRole('');
      setSelectedRoleId(null);
    } catch (error) {
      alert('권한 추가에 실패했습니다: ' + (error as Error).message);
    }
  };

  const handleRemoveRole = async (role: any) => {
    if (selectedUser) {
      try {
        const roleId =
          typeof role === 'string'
            ? // roleName으로 roleId 찾기
              Array.isArray(roles)
              ? roles.find((r: any) => r.roleName === role)?.roleId
              : null
            : role.roleId;

        if (!roleId) {
          alert('권한 ID를 찾을 수 없습니다.');
          return;
        }

        await removeUserRole.mutateAsync({
          userName: selectedUser.userName,
          roleId,
        });

        setOpenRemoveDialog(false);
        setSelectedUser(null);
      } catch (error) {
        alert('권한 삭제에 실패했습니다: ' + (error as Error).message);
      }
    }
  };

  const handleActivateUser = async (userName: string) => {
    try {
      await activateUser.mutateAsync(userName);
    } catch (error) {
      alert('사용자 활성화에 실패했습니다: ' + (error as Error).message);
    }
  };

  const handleDeactivateUser = async (userName: string) => {
    try {
      await deactivateUser.mutateAsync(userName);
    } catch (error) {
      alert('사용자 비활성화에 실패했습니다: ' + (error as Error).message);
    }
  };

  const handleResetLoginFailure = async (userName: string) => {
    try {
      await resetLoginFailure.mutateAsync(userName);
    } catch (error) {
      alert(
        '로그인 실패 횟수 초기화에 실패했습니다: ' + (error as Error).message,
      );
    }
  };

  // 에러 처리
  if (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    let message = error.message;

    if (status === 403) {
      message = '권한이 없습니다.';
    } else if (status === 401) {
      message = '로그인이 필요합니다.';
    }
    // 필요시 다른 상태코드도 추가

    return <Alert severity="error">에러: {message}</Alert>;
  }

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      isEnabled={isEnabled}
      loadingMessage="회원 목록을 불러오는 중..."
      showBackgroundSpinner={true}
    >
      {!data || data.length === 0 ? (
        <Typography>유저가 없습니다.</Typography>
      ) : (
        <List>
          {data.map((user: any) => (
            <ListItem key={user.userName} alignItems="flex-start">
              <ListItemText
                primary={
                  <Box>
                    {/* 사용자 이름과 상태 */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Typography fontWeight="bold" variant="h6">
                        {user.userName}
                      </Typography>
                      <Chip
                        label={user.useYn === 'Y' ? '활성' : '비활성'}
                        color={user.useYn === 'Y' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>

                    {/* 상세 정보 - 한 줄로 표시 */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        이메일: {user.email}
                      </Typography>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          권한:
                        </Typography>
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role: any) => (
                            <Chip
                              key={
                                typeof role === 'string' ? role : role.roleId
                              }
                              label={
                                typeof role === 'string' ? role : role.roleName
                              }
                              color="primary"
                              size="small"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            없음
                          </Typography>
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        로그인 실패: {user.loginFailureCount}회
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        마지막 실패:{' '}
                        {user.lastFailureTimestamp
                          ? new Date(user.lastFailureTimestamp).toLocaleString()
                          : '-'}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <IconButton
                onClick={(e) => handleMenuClick(e, user)}
                size="small"
              >
                <MoreVertIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* 권한 관리 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            setOpenAddDialog(true);
            handleMenuClose();
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          권한 추가
        </MenuItem>
        {selectedUser?.roles && selectedUser.roles.length > 0 && (
          <MenuItem
            onClick={() => {
              setOpenRemoveDialog(true);
              handleMenuClose();
            }}
          >
            <RemoveIcon sx={{ mr: 1 }} />
            권한 삭제
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (selectedUser) {
              if (selectedUser.useYn === 'Y') {
                handleDeactivateUser(selectedUser.userName);
              } else {
                handleActivateUser(selectedUser.userName);
              }
            }
            handleMenuClose();
          }}
        >
          {selectedUser?.useYn === 'Y' ? '비활성화' : '활성화'}
        </MenuItem>
        {selectedUser?.loginFailureCount > 0 && (
          <MenuItem
            onClick={() => {
              if (selectedUser) {
                handleResetLoginFailure(selectedUser.userName);
              }
              handleMenuClose();
            }}
          >
            로그인 실패 횟수 초기화
          </MenuItem>
        )}
      </Menu>

      {/* 권한 추가 다이얼로그 */}
      <Dialog
        open={openAddDialog}
        onClose={() => {
          setOpenAddDialog(false);
          setSelectedUser(null);
          setSelectedRole('');
        }}
      >
        <DialogTitle>권한 추가 - {selectedUser?.userName}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>권한 선택</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                // 선택된 권한의 roleId 찾기
                const selectedRoleData = Array.isArray(roles)
                  ? roles.find((role: any) => role.roleName === e.target.value)
                  : null;
                setSelectedRoleId(selectedRoleData?.roleId || null);
              }}
              label="권한 선택"
            >
              {Array.isArray(roles) &&
                roles
                  .filter(
                    (role: any) =>
                      !selectedUser?.roles?.includes(role.roleName),
                  )
                  .map((role: any) => (
                    <MenuItem key={role.roleId} value={role.roleName}>
                      {role.roleName} - {role.description}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenAddDialog(false);
              setSelectedUser(null);
              setSelectedRole('');
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleAddRole}
            variant="contained"
            disabled={!selectedRole}
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>

      {/* 권한 삭제 다이얼로그 */}
      <Dialog
        open={openRemoveDialog}
        onClose={() => {
          setOpenRemoveDialog(false);
          setSelectedUser(null);
        }}
      >
        <DialogTitle>권한 삭제 - {selectedUser?.userName}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>삭제할 권한을 선택하세요:</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {selectedUser?.roles?.map((role: any) => (
              <Button
                key={typeof role === 'string' ? role : role.roleId}
                variant="outlined"
                color="error"
                onClick={() => handleRemoveRole(role)}
                startIcon={<RemoveIcon />}
              >
                {typeof role === 'string' ? role : role.roleName}
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenRemoveDialog(false);
              setSelectedUser(null);
            }}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </DataLoader>
  );
}
