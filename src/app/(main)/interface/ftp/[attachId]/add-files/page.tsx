'use client';

import { useParams, useRouter } from 'next/navigation';
import { Typography, Button, Box } from '@mui/material';
import AttachFileAddForm from '@/components/interface/ftp/AttachFileAddForm';

export default function AttachFileAddPage() {
  const params = useParams();
  const router = useRouter();
  const attachId = Number(params.attachId);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Typography variant="h4" gutterBottom>
        첨부파일 추가
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        첨부 ID: {attachId}
      </Typography>
      <AttachFileAddForm attachId={attachId} />
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
