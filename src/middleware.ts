// middleware.ts
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { handleGlobalLogic } from './middleWares/global.middleware';
import {
  handleAuthorization,
  handleLoggedInRedirect,
} from './middleWares/auth.middleware';

// 1. withAuth로 인증/인가 미들웨어 생성
const authMiddleware = withAuth(
  async function middleware(req: any) {
    const token = req.nextauth.token;

    const loggedInRedirectResponse = await handleLoggedInRedirect(req, token);
    if (loggedInRedirectResponse) {
      return loggedInRedirectResponse;
    }

    const authorizationResponse = await handleAuthorization(req, token);
    if (authorizationResponse) {
      return authorizationResponse;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const publicPaths = [
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/register',
          '/api/auth',
        ];
        const isPublicPath = publicPaths.some((path) =>
          req.nextUrl.pathname.startsWith(path),
        );
        return !!token || isPublicPath;
      },
    },
    pages: {
      signIn: '/login',
    },
  },
);

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  // 글로벌 미들웨어 먼저 실행 아직 아무 기능 없음
  const globalResponse = await handleGlobalLogic(req);
  if (globalResponse) {
    return globalResponse;
  }

  return authMiddleware(req as NextRequestWithAuth, event);
}

// 제외할 경로 목록
export const config = {
  matcher: [
    '/((?!api|_next|favicon\\.ico|images|fonts|css|js|data|robots\\.txt|sitemap\\.xml|\\.well-known).*)',
  ],
};
