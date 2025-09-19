'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Typography,
  FormHelperText,
} from '@mui/material';
import { useRoleService } from '@/services/admin';

interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

interface RoleFilterProps {
  selectedRoles: number[];
  onRolesChange: (roleIds: number[]) => void;
  maxSelection?: number;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

export default function RoleFilter({
  selectedRoles = [],
  onRolesChange,
  maxSelection = 10,
  disabled = false,
  label = '권한 선택',
  helperText = '비교할 권한을 선택하세요 (최대 10개)',
}: RoleFilterProps) {
  const { roles } = useRoleService();
  const roleQuery = roles();
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  // 권한 데이터 로드
  useEffect(() => {
    if (roleQuery.data) {
      setAvailableRoles(roleQuery.data);
    }
  }, [roleQuery.data]);

  // 권한 선택 변경 처리
  const handleRoleChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];

    // 최대 선택 개수 제한
    if (value.length > maxSelection) {
      return;
    }

    onRolesChange(value);
  };

  // 권한 제거 처리
  const handleRoleRemove = (roleIdToRemove: number) => {
    const newSelectedRoles = selectedRoles.filter(
      (roleId) => roleId !== roleIdToRemove,
    );
    onRolesChange(newSelectedRoles);
  };

  // 권한 이름 조회
  const getRoleName = (roleId: number): string => {
    const role = availableRoles.find((r) => r.roleId === roleId);
    return role?.roleName || `권한 ${roleId}`;
  };

  // 권한 설명 조회
  const getRoleDescription = (roleId: number): string => {
    const role = availableRoles.find((r) => r.roleId === roleId);
    return role?.description || '';
  };

  return (
    <Box>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="role-filter-label">{label}</InputLabel>
        <Select
          labelId="role-filter-label"
          multiple
          value={selectedRoles}
          onChange={handleRoleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((roleId) => (
                <Chip
                  key={roleId}
                  label={getRoleName(roleId)}
                  onDelete={() => handleRoleRemove(roleId)}
                  deleteIcon={<span>×</span>}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          {availableRoles.map((role) => (
            <MenuItem
              key={role.roleId}
              value={role.roleId}
              disabled={
                !selectedRoles.includes(role.roleId) &&
                selectedRoles.length >= maxSelection
              }
            >
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {role.roleName}
                </Typography>
                {role.description && (
                  <Typography variant="caption" color="text.secondary">
                    {role.description}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {helperText}
          {selectedRoles.length > 0 && (
            <span style={{ marginLeft: '8px' }}>
              (선택됨: {selectedRoles.length}/{maxSelection})
            </span>
          )}
        </FormHelperText>
      </FormControl>

      {/* 선택된 권한 상세 정보 */}
      {selectedRoles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            선택된 권한:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedRoles.map((roleId) => (
              <Chip
                key={roleId}
                label={getRoleName(roleId)}
                onDelete={() => handleRoleRemove(roleId)}
                size="small"
                color="primary"
                variant="filled"
                title={getRoleDescription(roleId)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
