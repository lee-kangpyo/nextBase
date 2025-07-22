// src/app/(main)/interface/ftp/page.tsx
import FtpForm from '@/components/interface/ftp/FtpFrom';
import { Box, Typography } from '@mui/material';

export default function FtpPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Typography variant="h4" gutterBottom>
        FTP 전송
      </Typography>
      <FtpForm />
    </div>
  );
}
