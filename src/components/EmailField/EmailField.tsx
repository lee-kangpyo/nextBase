'use client';

import React from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';

interface EmailFieldProps {
  label: string;
  emails: string[];
  editingIndex: { field: string; index: number } | null;
  field: 'to' | 'cc' | 'bcc';
  onEmailChange: (
    field: 'to' | 'cc' | 'bcc',
    index: number,
    value: string,
  ) => void;
  onEmailKeyDown: (
    field: 'to' | 'cc' | 'bcc',
    index: number,
    e: React.KeyboardEvent,
  ) => void;
  onChipClick: (field: 'to' | 'cc' | 'bcc', index: number) => void;
  onChipDelete: (field: 'to' | 'cc' | 'bcc', index: number) => void;
  onAddEmail: (field: 'to' | 'cc' | 'bcc') => void;
}

export default function EmailField({
  label,
  emails,
  editingIndex,
  field,
  onEmailChange,
  onEmailKeyDown,
  onChipClick,
  onChipDelete,
  onAddEmail,
}: EmailFieldProps) {
  return (
    <Box>
      <Typography sx={{ mb: 1, fontWeight: 'bold', color: 'text.secondary' }}>
        {label}:
      </Typography>
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}
      >
        {emails.map((email, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {editingIndex?.field === field && editingIndex?.index === index ? (
              <TextField
                size="small"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(field, index, e.target.value)}
                onKeyDown={(e) => onEmailKeyDown(field, index, e)}
                onBlur={() => onChipClick(field, -1)} // 편집 모드 종료
                placeholder={`${label} 이메일 주소`}
                variant="outlined"
                sx={{ minWidth: 200 }}
                autoFocus
              />
            ) : (
              <Chip
                label={email || `${label} 추가`}
                onClick={() => onChipClick(field, index)}
                onDelete={email ? () => onChipDelete(field, index) : undefined}
                variant="outlined"
                size="small"
                sx={{
                  cursor: 'pointer',
                  minWidth: 120,
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              />
            )}
          </Box>
        ))}
        <Button
          size="small"
          onClick={() => onAddEmail(field)}
          sx={{ height: 40 }}
        >
          +
        </Button>
      </Box>
    </Box>
  );
}
