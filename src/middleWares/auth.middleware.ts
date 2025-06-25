import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인된 사용자 리다이렉트
export async function handleLoggedInRedirect(
  req: NextRequest,
  token: any,
): Promise<NextResponse | undefined> {
  const { pathname } = req.nextUrl;
  if (
    token &&
    (pathname === '/' || pathname === '/login' || pathname === '/register')
  ) {
    console.log(
      `[LoggedInRedirect] 로그인된 사용자(${token.sub})가 ${pathname} 접근 시도 -> /main으로 리다이렉트.`,
    );
    return NextResponse.redirect(new URL('/main', req.url));
  }
  return undefined;
}

// 권한 기반 인가
export async function handleAuthorization(
  req: NextRequest,
  token: any,
): Promise<NextResponse | undefined> {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && token?.role !== 'admin') {
    console.log(
      `[Authorization] 비인가 사용자(${token?.sub || '비로그인'})가 /admin 접근 시도 -> /denied로 리다이렉트.`,
    );
    return NextResponse.redirect(new URL('/denied', req.url));
  }
  return undefined;
}
