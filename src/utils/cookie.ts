import { cookies } from 'next/headers';

/**
 * Set-Cookie 헤더 배열에서 원하는 쿠키명에 해당하는 값과 expires를 추출
 * @param setCookieHeader 백엔드에서 받은 Set-Cookie 헤더 배열
 * @param cookieName 추출할 쿠키명
 * @returns { value, expires } (없으면 {})
 */
export function extractCookieValue(
  setCookieHeader: string[],
  cookieName: string,
): { value?: string; expires?: Date } {
  const match = setCookieHeader.find((cookie: string) =>
    cookie.startsWith(`${cookieName}=`),
  );
  if (!match) return {};
  const value = match.split(';')[0].split('=')[1];
  const expiresPart = match
    .split(';')
    .find((part) => part.trim().toLowerCase().startsWith('expires='));
  let expires: Date | undefined = undefined;
  if (expiresPart) {
    expires = new Date(expiresPart.split('=')[1].trim());
  }
  return { value, expires };
}

/**
 * 쿠키명, 값, expires를 받아 쿠키를 세팅
 */
export async function setCookie(
  cookieName: string,
  value: string,
  expires?: Date,
) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires,
  });
}

/**
 * Set-Cookie 헤더 배열에서 X-Refresh-Token 값을 추출하고, 쿠키로 저장
 * @param setCookieHeader 백엔드에서 받은 Set-Cookie 헤더 배열
 * @returns 추출된 refreshToken (없으면 undefined)
 */
export async function extractRefreshAndSetCookie(
  setCookieHeader: string[],
): Promise<string | undefined> {
  const { value, expires } = extractCookieValue(
    setCookieHeader,
    'X-Refresh-Token',
  );
  if (!value) return undefined;
  await setCookie('X-Refresh-Token', value, expires);
  return value;
}

/**
 * 응답 객체에서 X-Refresh-Token을 추출해 쿠키로 세팅하고, 값을 반환
 * @param res Axios 응답 객체 (headers['set-cookie'] 포함)
 * @returns 추출된 refreshToken (없으면 undefined)
 */
export async function handleRefreshTokenFromResponse(res: {
  headers: { [key: string]: any };
}): Promise<string | undefined> {
  const setCookieHeader = res.headers['set-cookie'];
  if (!setCookieHeader) return undefined;
  return await extractRefreshAndSetCookie(setCookieHeader);
}
