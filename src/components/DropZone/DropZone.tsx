'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DropZone({
  onFilesChange,
  showFileList = true,
  width = 'auto',
}: {
  onFilesChange?: (files: File[]) => void;
  showFileList?: boolean;
  width?: string | number;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      onFilesChange?.(newFiles);
    },
    [files, onFilesChange],
  );

  const handleDelete = (idx: number) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        border: '2px dashed #1976d2',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        bgcolor: isDragActive ? 'action.hover' : 'background.paper',
        cursor: 'pointer',
        width: width,
        mx: 'auto',
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="body1" color="primary" gutterBottom>
        {isDragActive
          ? '여기로 파일을 놓으세요!'
          : '여기로 파일을 드래그하거나 클릭해서 선택하세요.'}
      </Typography>
      {showFileList && (
        <List>
          {files.map((file, idx) => (
            <ListItem
              key={file.name + idx}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(idx);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
