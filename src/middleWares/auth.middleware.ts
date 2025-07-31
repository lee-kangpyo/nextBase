import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { middlewareLogger } from '@/utils/logger';

// 공통 퍼블릭 패스 정의
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
];

// 퍼블릭 경로인지 확인하는 함수
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  });
}

// 로그인된 사용자 리다이렉트
async function handleLoggedInRedirect(
  req: NextRequest,
  token: any,
): Promise<NextResponse | undefined> {
  const { pathname } = req.nextUrl;

  // /main 경로는 제외하고 실제 공개 페이지만 처리
  if (token && isPublicPath(pathname) && !pathname.startsWith('/main')) {
    middlewareLogger.info(
      `[LoggedInRedirect] 로그인된 사용자(${token.sub})가 ${pathname} 접근 시도 -> /main으로 리다이렉트.`,
    );
    return NextResponse.redirect(new URL('/main', req.url));
  }
  return undefined;
}

// 권한 기반 인가
async function handleAuthorization(
  req: NextRequest,
  token: any,
): Promise<NextResponse | undefined> {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && token?.role !== 'admin') {
    middlewareLogger.info(
      `[Authorization] 비인가 사용자(${token?.sub || '비로그인'})가 /admin 접근 시도 -> /denied로 리다이렉트.`,
    );
    return NextResponse.redirect(new URL('/denied', req.url));
  }
  return undefined;
}

// NextAuth 인증 미들웨어 생성
export const authMiddleware = withAuth(
  async function middleware(req: any) {
    const token = req.nextauth.token;
    middlewareLogger.info(
      `[AuthMiddleware] ${req.nextUrl.pathname} 접근 - 토큰: ${token ? '있음' : '없음'}`,
    );

    const loggedInRedirectResponse = await handleLoggedInRedirect(req, token);
    if (loggedInRedirectResponse) {
      middlewareLogger.info(
        `[AuthMiddleware] 로그인된 사용자 리다이렉트: ${req.nextUrl.pathname} -> /main`,
      );
      return loggedInRedirectResponse;
    }

    const authorizationResponse = await handleAuthorization(req, token);
    if (authorizationResponse) {
      middlewareLogger.info(
        `[AuthMiddleware] 권한 체크 리다이렉트: ${req.nextUrl.pathname} -> /denied`,
      );
      return authorizationResponse;
    }

    middlewareLogger.info(
      `[AuthMiddleware] 정상 처리: ${req.nextUrl.pathname}`,
    );
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const isPublic = isPublicPath(pathname);

        middlewareLogger.info(
          `[AuthMiddleware] authorized 체크: ${pathname}, 토큰: ${token ? '있음' : '없음'}, 공개경로: ${isPublic}`,
        );

        // 공개 페이지는 모든 사용자가 접근 가능 (미들웨어에서 세부 처리)
        if (isPublic) {
          return true;
        }

        // 보호된 페이지는 인증된 사용자만 접근 가능
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  },
);
