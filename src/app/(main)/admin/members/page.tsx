import { Typography } from '@mui/material';
import UserList from './UserList';

export default function MembersPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Typography variant="h4" gutterBottom>
        회원관리
      </Typography>
      <UserList />
    </div>
  );
}
