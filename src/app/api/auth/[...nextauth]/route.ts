import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { AuthSession, AuthUser } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '@/types/jwt';
import { getTest, login, reissueToken } from '@/actions/auth';
import { logger } from '@/utils/logger';
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        accessToken: { label: 'Access Token', type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
        user: { label: 'User', type: 'text' },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;
        // credentials에서 username, password 추출
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        // Server Action의 login 함수 호출
        try {
          const data = await login(formData);
          if (!data) return null;

          const payload = jwtDecode<MyJwtPayload>(data.accessToken);

          return {
            id: data.userName,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            userName: data.userName,
            roles: payload.roles,
            // ...필요한 정보 추가
          };
        } catch (e) {
          throw e;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AuthUser }) {
      // logger.info('jwt callback 호출');
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userName = user.userName;
        token.roles = user.roles;
      } else {
        // 이후 요청(세션 갱신 등)
        // accessToken 만료 체크 및 refresh 로직 추가 가능
        const now = Math.floor(Date.now() / 1000);
        const payload = jwtDecode(token.accessToken as string);
        if (payload.exp && payload.exp < now) {
          try {
            const refreshed = await reissueToken(token.refreshToken as string);
            token.accessToken = refreshed.accessToken;
            token.refreshToken = refreshed.refreshToken;
          } catch (e) {
            // refreshToken 만료/유효하지 않음 → 세션 무효화
            // 필요시 로그 등 추가
            throw e; // NextAuth가 세션을 무효화함
          }
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // logger.info('session callback 호출');
      session.user = {
        userName: token.userName as string,
        roles: token.roles as string[],
      };
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
