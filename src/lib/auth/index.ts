import { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ account, token, user }) {
      // console.log({ account, token, user });
      return token;
      // return token;
    },

    async session({ session, token }) {
      // console.log({ session, token });
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  pages: {
    error: '/',
  },
};
