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
import { useInterService } from '@/services/inter';

export default function AttachUploadForm() {
  const [file, setFile] = useState<File[]>([]);
  const [attachName, setAttachName] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const { useFtpUploadMutation } = useInterService();
  const {
    mutate: fileUpload,
    isPending,
    isSuccess,
    error,
  } = useFtpUploadMutation();

  const handleUpload = async () => {
    if (!file || !attachName) {
      setResult('첨부파일 묶음 이름 또는 파일을 첨부하세요.');
      return;
    }
    const data = {
      files: file,
      data: {
        attachName,
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
        첨부파일 새로 업로드
      </Typography>
      <TextField
        label="첨부파일 묶음 이름"
        type="text"
        value={attachName}
        onChange={(e) => setAttachName(e.target.value)}
      />
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
