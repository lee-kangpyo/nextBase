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
          const res = await login(formData);
          if (!res) return null;

          if (!res.success) {
            // Server Action에서 실패한 경우 에러 메시지를 throw
            throw new Error(res.message || '로그인에 실패했습니다.');
          }

          const payload = jwtDecode<MyJwtPayload>(res.data.accessToken);

          return {
            id: res.data.userName,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            userName: res.data.userName,
            roles: payload.roles,
          };
        } catch (e) {
          throw e;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AuthUser }) {
      logger.info('jwt callback 호출');
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userName = user.userName;
        token.roles = user.roles;
      }

      // accessToken 만료 체크
      const now = Math.floor(Date.now() / 1000);
      const payload = jwtDecode(token.accessToken as string);
      logger.info(
        `[JWT Callback] 토큰 만료 체크 - 현재: ${now}, 만료: ${payload.exp}`,
      );
      if (payload.exp && payload.exp > now) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      logger.info('session callback 호출');
      session.user = {
        userName: token.userName as string,
        roles: token.roles as string[],
      };
      session.accessToken = token.accessToken as string;
      // refreshToken은 쿠키로만 관리하므로 세션에서 제거
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const refreshAccessToken = async (jwt: JWT) => {
  if (!jwt.refreshToken) {
    logger.error('[JWT Callback] refresh token이 없습니다.');
    throw new Error('No refresh token');
  }
  try {
    const refreshed = await reissueToken(jwt.refreshToken as string);
    jwt.accessToken = refreshed.accessToken;
    jwt.refreshToken = refreshed.refreshToken;
    logger.info('[JWT Callback] 토큰 재발급 성공');
    return jwt;
  } catch (e) {
    logger.error('[JWT Callback] 토큰 재발급 실패:', e);
    throw e;
  }
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
