import { User } from 'next-auth';

export interface AuthUser extends User {
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthSession extends Session {
  accessToken?: string;
  refreshToken?: string;
}
