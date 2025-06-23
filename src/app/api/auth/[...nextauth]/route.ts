import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { AuthSession, AuthUser } from '@/types/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        accessToken: { label: 'Access Token', type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
        user: { label: 'User', type: 'text' },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        console.log('credentials');
        if (!credentials?.accessToken || !credentials?.refreshToken)
          return null;

        const user = {
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
          ...JSON.parse(credentials.user || '{}'),
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AuthUser }) {
      console.log('jwt');
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('session');
      session.user = {
        email: token.email as string,
      };
      (session as AuthSession).accessToken = token.accessToken as
        | string
        | undefined;
      (session as AuthSession).refreshToken = token.refreshToken as
        | string
        | undefined;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
