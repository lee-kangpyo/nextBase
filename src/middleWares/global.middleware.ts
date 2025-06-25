// src/middlewares/global.middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function handleGlobalLogic(
  req: NextRequest,
): Promise<NextResponse | undefined> {
  const response = NextResponse.next();
  // 예: 모든 응답에 커스텀 헤더 추가
  response.headers.set('X-Custom-Header', 'My-App-Data');

  // 예: 특정 조건에서만 응답 반환 (예: 점검 모드)
  // if (isMaintenanceMode) {
  //   return NextResponse.redirect(new URL('/maintenance', req.url));
  // }

  console.log('[GlobalMiddleware] 완료.');
  return undefined;
}
