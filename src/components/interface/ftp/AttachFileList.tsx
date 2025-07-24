import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import dayjs from 'dayjs';
import {
  downloadBundle,
  useAttachFiles,
  downloadFile,
} from '@/services/interService';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';

interface AttachFileListProps {
  attachId: number;
}

export default function AttachFileList({ attachId }: AttachFileListProps) {
  const api = useApi();
  const router = useRouter();
  const { data, isLoading, error } = useAttachFiles(attachId);

  const handleDownload = (fileId: number) => {
    downloadFile(api, fileId);
  };
  const handleDownloadBundle = () => {
    downloadBundle(api, attachId);
  };

  return (
    <Paper sx={{ mb: 4, p: 2 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">파일 목록</Typography>
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={handleDownloadBundle}
          >
            전체 다운로드 (ZIP)
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push(`/interface/ftp/${attachId}/add-files`)}
            sx={{ ml: 1 }}
          >
            파일 추가
          </Button>
        </Box>
      </Box>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={120}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">파일 목록 조회 실패: {error.message}</Alert>
      ) : !data || data.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ my: 3 }}>
          파일이 없습니다.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>fileId</TableCell>
                <TableCell>파일명</TableCell>
                <TableCell>크기(Byte)</TableCell>
                <TableCell>업로드일시</TableCell>
                <TableCell>다운로드</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.fileId}>
                  <TableCell>{row.fileId}</TableCell>
                  <TableCell>{row.originalFileName}</TableCell>
                  <TableCell>{row.fileSize.toLocaleString()}</TableCell>
                  <TableCell>
                    {dayjs(row.uploadedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleDownload(row.fileId)}
                    >
                      다운로드
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
