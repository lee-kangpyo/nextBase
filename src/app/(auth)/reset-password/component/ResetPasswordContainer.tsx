import { Box, Card, CardContent } from '@mui/material';
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

export default function ResetPasswordContainer({ children }: ContainerProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f2f5"
    >
      <Card
        sx={{
          minWidth: 320,
          maxWidth: 400,
          width: '100%',
          boxShadow: 6,
          borderRadius: 3,
          p: 2,
        }}
      >
        <CardContent>{children}</CardContent>
      </Card>
    </Box>
  );
}
