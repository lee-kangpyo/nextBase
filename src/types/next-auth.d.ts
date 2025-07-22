import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    roles?: string[];
  }
  interface Session {
    user: {
      roles?: string[];
      userName?: string;
    };
    accessToken?: string;
    // refreshToken은 쿠키로만 관리하므로 제거
  }
}
