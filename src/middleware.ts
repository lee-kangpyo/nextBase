// middleware.ts
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { NextRequestWithAuth } from 'next-auth/middleware';
import { handleGlobalLogic } from './middleWares/global.middleware';
import { authMiddleware } from './middleWares/auth.middleware';
import { middlewareLogger } from '@/utils/logger';
import { getToken } from 'next-auth/jwt';

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  middlewareLogger.info(`시작: ${req.nextUrl.pathname}`);

  // 글로벌 미들웨어 먼저 실행
  const globalResponse = await handleGlobalLogic(req);
  if (globalResponse) {
    return globalResponse;
  }

  // 로그인 페이지에 대한 특별 처리
  if (req.nextUrl.pathname === '/login') {
    const token = await getToken({ req });
    if (token) {
      middlewareLogger.info(
        '인증된 사용자가 /login 접근 -> /main으로 리다이렉트',
      );
      return NextResponse.redirect(new URL('/main', req.url));
    }
  }

  // 일반적인 인증 미들웨어 실행
  return authMiddleware(req as NextRequestWithAuth, event);
}

// 제외할 경로 목록
export const config = {
  matcher: [
    '/((?!api|_next|favicon\\.ico|images|fonts|css|js|data|robots\\.txt|sitemap\\.xml|\\.well-known).*)',
  ],
};
