// types/jwt.ts
export type MyJwtPayload = {
  sub: string;
  roles: string[];
  iat?: number;
  exp?: number;
  [key: string]: any;
};
