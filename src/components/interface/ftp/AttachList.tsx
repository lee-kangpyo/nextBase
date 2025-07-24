'use client';
import React, { useState } from 'react';
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
  TablePagination,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useApi } from '@/hooks/useApi';
import { useAttachList } from '@/services/interService';
import dayjs from 'dayjs';
import AttachFileList from './AttachFileList';
import { useFtpStore } from '@/stores/ftpStore';

interface AttachResponse {
  attachId: number;
  attachName: string;
  creatorId: string;
  createdAt: string;
}

interface PageResponse {
  content: AttachResponse[];
  totalElements: number;
  size: number;
  number: number;
}

export default function AttachList() {
  const api = useApi();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { selectedAttachId, setSelectedAttachId } = useFtpStore();

  const {
    data: attachList,
    isLoading,
    error,
  } = useAttachList(page, rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ mb: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        첨부파일 묶음 목록
      </Typography>
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
        <Alert severity="error">목록 조회 실패: {error.message}</Alert>
      ) : !attachList || attachList.content.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ my: 3 }}>
          첨부파일 묶음이 없습니다.
        </Typography>
      ) : (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>attachId</TableCell>
                  <TableCell>attachName</TableCell>
                  <TableCell>creatorId</TableCell>
                  <TableCell>createdAt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attachList.content.map((row) => (
                  <TableRow
                    key={row.attachId}
                    hover
                    selected={selectedAttachId === row.attachId}
                    onClick={() => setSelectedAttachId(row.attachId)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{row.attachId}</TableCell>
                    <TableCell>{row.attachName}</TableCell>
                    <TableCell>{row.creatorId}</TableCell>
                    <TableCell>
                      {dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={attachList.totalElements}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </TableContainer>
          {selectedAttachId && <AttachFileList attachId={selectedAttachId} />}
        </>
      )}
    </Paper>
  );
}
