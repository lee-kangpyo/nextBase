'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import DropZone from '@/components/DropZone/DropZone';
import { useInterService } from '@/services/inter';
import { useRouter } from 'next/navigation';
import { useFtpStore } from '@/stores/ftpStore';

interface AttachFileAddFormProps {
  attachId: number;
}

export default function AttachFileAddForm({
  attachId,
}: AttachFileAddFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();
  const { setSelectedAttachId } = useFtpStore();

  const { useAttachFileAddMutation } = useInterService();
  const {
    mutate: addFiles,
    isPending,
    isSuccess,
    error,
  } = useAttachFileAddMutation(attachId);

  const handleUpload = () => {
    if (!files || files.length === 0) {
      setResult('추가할 파일을 선택하세요.');
      return;
    }
    addFiles(files);
  };

  const handleFilesChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setResult(null);
  };

  // 성공 시 해당 attachId를 선택하고 목록으로 이동
  useEffect(() => {
    if (isSuccess) {
      setSelectedAttachId(attachId);
      setTimeout(() => {
        router.push('/interface/ftp');
      }, 1500);
    }
  }, [isSuccess, router, attachId, setSelectedAttachId]);

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        첨부 ID {attachId}에 파일 추가
      </Typography>
      <DropZone onFilesChange={handleFilesChange} />
      <Box display="flex" flexDirection="column" gap={2} className="mt-4">
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={isPending || files.length === 0}
        >
          {isPending ? <CircularProgress size={24} /> : '파일 추가'}
        </Button>
        {isSuccess && <Alert severity="success">파일 추가 성공!</Alert>}
        {error && (
          <Alert severity="error">파일 추가 실패: {error.message}</Alert>
        )}
        {result && !isSuccess && !error && (
          <Alert severity="info">{result}</Alert>
        )}
      </Box>
    </Paper>
  );
}
