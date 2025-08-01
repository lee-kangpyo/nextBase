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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from '@/services/adminService';

// 타입 정의 추가
interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

export default function RolesPage() {
  const { data: roles, isLoading } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const [openDialog, setOpenDialog] = useState(false);
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

  if (isLoading) {
    return <Typography>로딩 중...</Typography>;
  }

  return (
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
                    <IconButton onClick={() => deleteRole.mutate(role.roleId)}>
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
    </Box>
  );
}
