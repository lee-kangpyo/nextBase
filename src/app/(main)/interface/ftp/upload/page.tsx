'use client';
import AttachUploadForm from '@/components/interface/ftp/AttachUploadForm';
import { Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function FtpUploadPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Typography variant="h4" gutterBottom>
        첨부파일 새로 업로드
      </Typography>
      <AttachUploadForm />
      <Box mt={4}>
        <Button
          variant="outlined"
          onClick={() => router.push('/interface/ftp')}
        >
          목록으로 이동
        </Button>
      </Box>
    </div>
  );
}
