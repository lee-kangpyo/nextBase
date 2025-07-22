// /app/(main)/layout.tsx
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { logout } from '@/actions/auth';
import { signOut } from 'next-auth/react';
import { SessionGuard } from '@/components/SessionGuard/SessionGuard';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionGuard>
      <div
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}
      >
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </div>
    </SessionGuard>
  );
}
