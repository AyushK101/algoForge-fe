import { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
// import GoogleProvider from 'next-auth/providers/google';
// import { tokenService } from '../services/tokenService';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ account, token, profile, user, session, trigger }) {
      // console.log({ account, token, profile, user, session, trigger });
      // First time login
      // if (account && user) {
      //   const accessToken = await tokenService.signAccessToken({
      //     userId: user.id,
      //     role: "user",
      //   });

      //   const refreshToken = await tokenService.signRefreshToken({
      //     userId: user.id,
      //     role: "user",
      //   });

      //   // Set refreshToken cookie manually
      //    (await cookies()).set("refreshToken", refreshToken, {
      //     httpOnly: true,
      //     secure: true,
      //     path: "/",
      //     maxAge: 60 * 60 * 24 * 7, // 7 days
      //     sameSite: "lax",
      //   });

      //   token.accessToken = accessToken;
      //   token.refreshToken = refreshToken;
      //   token.userId = user.id;
      // }
      return token;
      // return token;
    },

    async session({ newSession, session, token, trigger, user }) {
      // console.log({ newSession, session, token, trigger, user });
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  pages: {
    'error': '/',
  },
};
