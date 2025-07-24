// src/app/(main)/interface/ftp/page.tsx
'use client';
import AttachList from '@/components/interface/ftp/AttachList';
import { Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function FtpListPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" gutterBottom>
          첨부파일 묶음 목록
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/interface/ftp/upload')}
        >
          새 첨부파일 업로드
        </Button>
      </Box>
      <AttachList />
    </div>
  );
}
