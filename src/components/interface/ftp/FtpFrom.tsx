'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import DropZone from '@/components/DropZone/DropZone';
import { useMutation } from '@tanstack/react-query';
import { useFtpUploadMutation } from '@/services/interService';

export default function FtpForm() {
  const [file, setFile] = useState<File[]>([]);
  const [remoteFileName, setRemoteFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const {
    mutate: fileUpload,
    isPending,
    isSuccess,
    error,
  } = useFtpUploadMutation();

  const handleUpload = async () => {
    if (!file) {
      setResult('파일을 선택하세요.');
      return;
    }
    const data = {
      files: file,
      data: {
        remoteFileName: remoteFileName,
      },
    };
    fileUpload(data);
  };

  const handleFilesChange = (files: File[]) => {
    setFile(files);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        FTP 파일 업로드
      </Typography>
      <DropZone onFilesChange={handleFilesChange} />
      <Box display="flex" flexDirection="column" gap={2} className="mt-4">
        <Button variant="contained" onClick={handleUpload} disabled={isPending}>
          {isPending ? <CircularProgress size={24} /> : '업로드'}
        </Button>
        {isSuccess && <Alert severity="success">업로드 성공!</Alert>}
        {error && <Alert severity="error">업로드 실패: {error.message}</Alert>}
      </Box>
    </Paper>
  );
}
