import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { AuthSession, AuthUser } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '@/types/jwt';
import {
  getTest,
  login,
  reissueToken,
  googleLogin,
  naverLogin,
} from '@/actions/auth';
import { authLogger } from '@/utils/logger';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      async profile(profile) {
        // 서버 액션을 사용하여 구글 로그인 처리
        try {
          const result = await googleLogin({
            email: profile.email,
            name: profile.name,
            sub: profile.sub,
          });

          if (!result.success) {
            throw new Error(
              result.message || '구글 로그인 처리에 실패했습니다.',
            );
          }

          // result.data가 존재하는지 확인
          if (!result.data) {
            throw new Error('구글 로그인 응답 데이터가 없습니다.');
          }

          const payload = jwtDecode<MyJwtPayload>(result.data.accessToken);

          return {
            id: profile.sub,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
            userName: result.data.userName,
            roles: payload.roles,
          };
        } catch (error) {
          authLogger.error('[GoogleProvider] 구글 로그인 처리 실패:', error);
          throw error;
        }
      },
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_CLIENT_SECRET as string,
      authorization: {
        params: {
          response_type: 'code',
        },
      },
      async profile(profile) {
        // 서버 액션을 사용하여 네이버 로그인 처리
        authLogger.info('[NaverProvider] 네이버 프로필 데이터 받음:', profile);

        // 네이버 API 응답 구조에 맞게 데이터 매핑
        const naverProfile = {
          id: profile.response?.id || profile.id,
          email: profile.response?.email || profile.email,
          name: profile.response?.name || profile.name,
        };

        authLogger.info('[NaverProvider] 매핑된 네이버 프로필:', naverProfile);

        try {
          const result = await naverLogin({
            email: naverProfile.email,
            name: naverProfile.name,
            sub: naverProfile.id,
          });

          authLogger.info('[NaverProvider] naverLogin 결과:', result);

          if (!result.success) {
            throw new Error(
              result.message || '네이버 로그인 처리에 실패했습니다.',
            );
          }

          // result.data가 존재하는지 확인
          if (!result.data) {
            throw new Error('네이버 로그인 응답 데이터가 없습니다.');
          }

          const payload = jwtDecode<MyJwtPayload>(result.data.accessToken);

          return {
            id: naverProfile.id,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
            userName: result.data.userName,
            roles: payload.roles,
          };
        } catch (error) {
          authLogger.error('[NaverProvider] 네이버 로그인 처리 실패:', error);
          throw error;
        }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
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
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AuthUser }) {
      authLogger.info('[JWT Callback] 호출');
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userName = user.userName;
        token.roles = user.roles;
      }

      // accessToken 만료 체크
      const now = Math.floor(Date.now() / 1000);
      const payload = jwtDecode(token.accessToken as string);
      const timeUntilExpiry = payload.exp ? payload.exp - now : 0;

      authLogger.info(
        `[JWT Callback] 토큰 만료 체크 - 현재: ${now}, 만료: ${payload.exp}, 남은 시간: ${timeUntilExpiry}초`,
      );

      // 토큰이 유효하고 5분 이상 남아있으면 그대로 반환
      if (payload.exp && timeUntilExpiry > 300) {
        return token;
      }

      // 토큰이 만료되었거나 곧 만료될 예정이면 갱신
      authLogger.info('[JWT Callback] 토큰 갱신 필요 - 갱신 시도');
      return refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      authLogger.info('[SessionCallback] 호출');
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
    authLogger.error(
      '[JWT Callback - refreshAccessToken] refresh token이 없습니다.',
    );
    throw new Error('No refresh token');
  }

  authLogger.info('[JWT Callback - refreshAccessToken] 토큰 재발급 시작');
  try {
    const refreshed = await reissueToken(jwt.refreshToken as string);
    jwt.accessToken = refreshed.accessToken;
    jwt.refreshToken = refreshed.refreshToken;

    authLogger.info('[JWT Callback - refreshAccessToken] 토큰 재발급 성공');
    return jwt;
  } catch (e) {
    authLogger.error(
      '[JWT Callback - refreshAccessToken] 토큰 재발급 실패:',
      e,
    );
    // 토큰 갱신 실패 시 기존 토큰을 제거하여 재로그인 유도
    jwt.accessToken = undefined;
    jwt.refreshToken = undefined;
    throw e;
  }
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
