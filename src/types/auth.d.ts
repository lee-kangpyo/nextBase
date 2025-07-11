import { User } from 'next-auth';
import { Session } from 'next-auth/jwt';
export interface AuthUser extends User {
  accessToken?: string;
  refreshToken?: string;
  userName?: string;
}

export interface AuthSession extends Session {
  accessToken?: string;
  refreshToken?: string;
  roles?: string[];
}
